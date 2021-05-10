import {
  AutoComplete,
  Avatar,
  Button,
  Col,
  Form,
  message,
  Row,
  Table,
  Tag,
  Typography,
} from 'antd';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import {
  DeleteOutlined,
  EditOutlined,
  FileExcelOutlined,
  PlusCircleFilled,
  TeamOutlined,
} from '@ant-design/icons';

import LayoutWrapper from '../../components/LayoutWrapper';
import { StoreActions } from '../../redux/actions/store.actions';
import { Header, Title } from './styles';
import StoreForm from '../../components/StoreForm';
import http from '../../configs/axios';
import RemoveForm from '../../components/RemoveForm';
import StoreDetail from '../../components/StoreDetail';
import debounce from 'lodash/debounce';
import Search from '../../components/Search';
import { getItemLocalStorage } from '../../utils/storage.utils';
import { BRAND_ID_LOCALSTORAGE } from '../../constants/service';

const queryString = require('querystring');

const INITIAL_REMOVE_FORM_PROPS = {
  visible: false,
  title: '',
  description: '',
  item: null,
};

const INITIAL_FORM_PROPS = {
  visible: false,
  title: '',
  item: null,
};

const INITIAL_STORE_DETAIL_VIEW = {
  visible: false,
  item: null,
  title: '',
};

const INITIAL_SEARCH = {
  pageIndex: 1,
  pageSize: 10,
  fields: 'managers, employees',
};

const StoresPage = ({
  storeList,
  loading,
  onGetStores,
  onDeleteStore,
  onDownLoadStores,
}) => {
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize] = useState(10);
  const [processing, setProcessing] = useState(false);
  const [searching, setSearching] = useState(false);
  const [formProps, setFormProps] = useState(INITIAL_FORM_PROPS);
  const [removeFormProps, setRemoveFormProps] = useState(
    INITIAL_REMOVE_FORM_PROPS
  );
  const [storeDetailView, setStoreDetailView] = useState(
    INITIAL_STORE_DETAIL_VIEW
  );
  const [querySearch, setQuerySearch] = useState(INITIAL_SEARCH);

  const [form] = Form.useForm();

  const [storeSearchList, setStoreSearchList] = useState([]);

  const brandId = getItemLocalStorage(BRAND_ID_LOCALSTORAGE);

  const startRemovingHandler = (item) => {
    setRemoveFormProps((curr) => ({
      ...curr,
      visible: true,
      title: (
        <Typography.Text type="danger">
          Are you sure to delete this store?
        </Typography.Text>
      ),
      description: `You are trying to delete store ${item.name}, it will deactivate this store.`,
      item,
    }));
  };

  const startEditingHandler = (item) => {
    let title = 'Add New Store';
    if (item) {
      title = 'Update Store';
    }
    setFormProps((curr) => ({
      ...curr,
      visible: true,
      title: title,
      item: item ?? null,
    }));
  };

  const removeStoreHandler = (id) => {
    onDeleteStore(id, querySearch);
    setRemoveFormProps(INITIAL_REMOVE_FORM_PROPS);
  };

  const formSubmittedHandler = (formValue) => {
    //* Define URI
    console.log('formvalue', formValue);
    let isEditing = false;
    let uri = '/stores';

    if (formValue.id) {
      // Editing
      isEditing = true;
      uri += `/${formValue.id}`;
    }

    //* Construct formData
    const brandId = getItemLocalStorage(BRAND_ID_LOCALSTORAGE);
    const formData = new FormData();
    formData.append('code', formValue.code);
    if (formValue.photo) {
      formData.append('photo', formValue.photo[0].originFileObj);
    }
    formData.append('name', formValue.name);
    formData.append('address', formValue.address);
    formData.append('brandId', brandId);

    setProcessing(true);
    if (!isEditing) {
      http
        .post(uri, formData, {
          headers: {
            brandId,
          },
        })
        .then(() => {
          setProcessing(false);
          onGetStores(pageIndex, pageSize);
          message.success('Add successfully.');
          form.resetFields();
          setFormProps((curr) => ({
            ...curr,
            visible: false,
            title: '',
          }));
        })
        .catch((error) => {
          setProcessing(false);
        });
    } else {
      http
        .put(uri, formData, {
          headers: {
            brandId,
          },
        })
        .then(() => {
          setProcessing(false);
          onGetStores(pageIndex, pageSize);
          message.success('Update successfully.');
          form.resetFields();
          setFormProps(INITIAL_FORM_PROPS);
        })
        .catch((error) => {
          setProcessing(false);
        });
    }
  };

  useEffect(() => {
    onGetStores(querySearch);
  }, [onGetStores, querySearch]);

  const columns = [
    {
      dataIndex: 'name',
      align: 'center',
      title: 'STORE NAME',
      render: (_, record) => {
        return (
          <div style={{ display: 'flex', marginLeft: '20%' }}>
            <Avatar
              size="large"
              src={record.photoUrl}
              style={{ marginRight: '10px' }}
            />
            <span style={{ padding: '10px' }}>{record.name}</span>
          </div>
        );
      },
    },
    {
      dataIndex: 'address',
      align: 'center',
      title: 'STORE LOCATION',
    },
    {
      dataIndex: 'totalEmployees',
      align: 'center',
      title: 'TOTAL EMPLOYEES',
      sorter: (a, b) => a.employees.length - b.employees.length,
      render: (_, record) => {
        return (
          <div>
            <TeamOutlined />
            <span style={{ marginLeft: 10 }}>{record.employees?.length}</span>
          </div>
        );
      },
    },
    {
      dataIndex: 'status',
      align: 'center',
      title: 'STATUS',
      filters: [
        {
          text: 'Active',
          value: 1,
        },
        {
          text: 'Inactive',
          value: 0,
        },
      ],
      render: (value) => {
        var bool = !!parseInt(value);
        return (
          <Tag color={bool ? 'success' : 'error'}>
            {bool ? 'Active' : 'Inactive'}
          </Tag>
        );
      },
    },
    {
      title: 'ACTIONS',
      align: 'center',
      render: (_, record) => {
        var isActive = !!parseInt(record.status);

        return (
          <Row justify="center" gutter={8}>
            <Col>
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  startEditingHandler(record);
                }}
                shape="circle"
                size="large"
                type="primary"
                icon={<EditOutlined />}
              />
            </Col>
            <Col>
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  startRemovingHandler(record);
                }}
                disabled={!isActive}
                shape="circle"
                size="large"
                danger
                icon={<DeleteOutlined />}
              />
            </Col>
          </Row>
        );
      },
    },
  ];

  const onSearch = async (val) => {
    setSearching(true);
    try {
      const query = queryString.stringify({
        name: val,
        brandId,
      });
      http.get(`/stores?${query}`).then((res) => {
        setSearching(false);
        setStoreSearchList(res.data.data);
      });
    } catch (error) {}
  };

  const onSelect = async (val, option) => {
    const { data } = await http.get(`/stores/${option.key}?fields=employees`, {
      headers: {
        brandId,
      },
    });
    startViewStoreDetails(data);
  };

  const handleChangeTable = (pagination, filters, sorter, extra) => {
    if (filters?.status?.length !== 1) {
      setQuerySearch(INITIAL_SEARCH);
    } else {
      setQuerySearch((prev) => ({
        ...prev,
        status: filters.status[0],
      }));
    }
  };

  const startViewStoreDetails = (item) => {
    setStoreDetailView({
      visible: true,
      item,
      title: 'Store Detail',
    });
  };

  return (
    <LayoutWrapper>
      <Header>
        <Title>STORES</Title>
        <Search
          // options={storeSearchList}
          onSearch={debounce(onSearch, 240)}
          onSelect={onSelect}
          placeholder="Search store by name"
        >
          {storeSearchList.map((store) => (
            <AutoComplete.Option key={store.id} value={store.name}>
              <div style={{ display: 'flex' }}>
                <Avatar size="large" src={store.photoUrl} />
                <span style={{ marginLeft: 10, marginTop: 10 }}>
                  {store.name}
                </span>
              </div>
            </AutoComplete.Option>
          ))}
        </Search>
      </Header>
      <Header>
        <div />
        <Button
          type="primary"
          size="large"
          icon={<PlusCircleFilled />}
          onClick={() => startEditingHandler()}
        >
          Add New Store
        </Button>
      </Header>
      <Button
        icon={<FileExcelOutlined />}
        style={{ background: '#f6ffed', color: '#52c41a' }}
        onClick={() => onDownLoadStores()}
      >
        Download Report
      </Button>
      <Table
        rowKey="id"
        dataSource={storeList.data}
        columns={columns}
        loading={loading}
        onChange={handleChangeTable}
        onRow={(data) => {
          return {
            onClick: () => {
              setStoreDetailView((curr) => ({
                ...curr,
                item: data,
                title: 'Store Detail',
                visible: true,
              }));
            },
          };
        }}
        pagination={{
          current: pageIndex,
          total: storeList.totalItems,
          pageSize: pageSize,
          onChange: (page) => {
            setPageIndex(page);
            setQuerySearch((prevQuery) => ({
              ...prevQuery,
              pageIndex: page,
            }));
          },
        }}
      />
      <StoreForm
        {...formProps}
        loading={processing}
        form={form}
        onFinish={formSubmittedHandler}
        onCancel={() => {
          form.resetFields();
          setFormProps(INITIAL_FORM_PROPS);
        }}
      />
      <RemoveForm
        {...removeFormProps}
        loading={processing}
        onFinish={() => {
          removeStoreHandler(removeFormProps.item.id);
        }}
        onCancel={() => {
          setRemoveFormProps((curr) => ({
            ...curr,
            visible: false,
            title: '',
            description: '',
            item: null,
          }));
        }}
      />
      <StoreDetail
        visible={storeDetailView.visible}
        item={storeDetailView.item}
        onCancel={() => setStoreDetailView(INITIAL_STORE_DETAIL_VIEW)}
      />
    </LayoutWrapper>
  );
};

const mapStateToProps = (state) => ({
  storeList: state.store.storeList,
  loading: state.store.loading,
});

const mapDispatchToProps = (dispatch) => ({
  onGetStores: (query) => dispatch(StoreActions.getStoresRequest(query)),
  onDeleteStore: (id, query) =>
    dispatch(StoreActions.deleteStoreRequest(id, query)),
  onDownLoadStores: () => dispatch(StoreActions.downloadStoresRequest()),
});

export default connect(mapStateToProps, mapDispatchToProps)(StoresPage);
