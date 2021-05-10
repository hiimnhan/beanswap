import {
  CheckOutlined,
  CloseOutlined,
  DeleteOutlined,
  EditOutlined,
  FileExcelOutlined,
  PlusCircleFilled,
  PlusOutlined,
} from '@ant-design/icons';
import {
  AutoComplete,
  Button,
  Col,
  Form,
  message,
  Modal,
  Popconfirm,
  Row,
  Switch,
  Table,
  Tag,
  Avatar,
  Tooltip,
} from 'antd';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import debounce from 'lodash/debounce';
import moment from 'moment';

import EmployeeForm from '../../components/EmployeeForm';
import LayoutWrapper from '../../components/LayoutWrapper';
import Search from '../../components/Search';
import { EmployeeActions } from '../../redux/actions/employee.actions';
import { Header, Title } from './styles';
import http from '../../configs/axios';
import RemoveForm from '../../components/RemoveForm';
import UserInfoForm from '../../components/EmployeeForm/UserInfoForm';
import EmployeeStoreForm from '../../components/EmployeeStoreForm';
import EmployeeDetails from '../../components/EmployeeDetails';
import Loading from '../../components/Loading';
import { getItemLocalStorage } from '../../utils/storage.utils';
import { BRAND_ID_LOCALSTORAGE } from '../../constants/service';
const queryString = require('querystring');

const INITIAL_FORM_PROPS = {
  visible: false,
  title: '',
};

const INITIAL_DETAILS_FORM_PROPS = {
  visible: false,
  title: '',
  description: '',
  item: null,
};

const INITIAL_SEARCH = {
  pageIndex: 1,
  pageSize: 10,
  field: 'stores',
};

const EmployeesPage = ({
  employeeList,
  loading,
  onGetEmployees,
  onToggleEmployeeStatus,
  onDownloadEmployees,
  success,
}) => {
  //* Form instance
  const [userInfoForm] = Form.useForm();
  const [employeeStoresForm] = Form.useForm();
  const [removeFormProps, setRemoveFormProps] = useState(
    INITIAL_DETAILS_FORM_PROPS
  );
  const [userInfoFormProps, setUserInfoFormProps] = useState(
    INITIAL_DETAILS_FORM_PROPS
  );
  const [employeeStoresFormProps, setEmployeeStoresFormProps] = useState(
    INITIAL_DETAILS_FORM_PROPS
  );
  const [formProps, setFormProps] = useState(INITIAL_FORM_PROPS);
  const [detailsModalProps, setDetailsModalProps] = useState(
    INITIAL_DETAILS_FORM_PROPS
  );

  const [switchManagerLoading, setSwitchManagerLoading] = useState(false);

  const brandId = getItemLocalStorage(BRAND_ID_LOCALSTORAGE);

  //* Data state
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize] = useState(10);
  const [employeeSearchList, setEmployeeSearchList] = useState([]);

  const [querySearch, setQuerySearch] = useState(INITIAL_SEARCH);

  const [processing, setProcessing] = useState(false);

  const startAddingEmployeeStoreHandler = (employeeInfo) => {
    setEmployeeStoresFormProps((curr) => ({
      ...curr,
      item: employeeInfo,
      visible: true,
      title: 'Add New Store',
    }));
  };

  const startEditingHandler = (item) => {
    setUserInfoFormProps((curr) => ({
      ...curr,
      item,
      title: 'Update User Info',
      visible: true,
    }));
    userInfoForm.setFieldsValue({
      code: item.code,
      firstName: item.firstName,
      lastName: item.lastName,
      birthDate: moment(item.birthDate),
      phoneNumber: item.phoneNumber.replace('+84', '0'),
      email: item.email,
      address: item.address,
      isBrandAdmin: item.isBrandAdmin,
    });
  };

  const startCreatingHandler = () => {
    const title = 'Add New Employee';
    setFormProps((curr) => ({
      ...curr,
      visible: true,
      title: title,
    }));
  };

  const toggleEmployeeStatusHandler = (item) => {
    onToggleEmployeeStatus(item, {
      ...INITIAL_SEARCH,
    });
  };

  const employeeStoreRemovedHandler = (storeId, employeeInfo) => {
    const stores = employeeInfo.stores.map((s) => ({
      storeId: s.store.id,
      isManager: s.isManager,
      status: s.status === 0 ? 0 : s.store.id === storeId ? 0 : 1,
    }));
    const formData = new FormData();

    formData.append('code', employeeInfo.code);
    formData.append('firstName', employeeInfo.firstName);
    formData.append('lastName', employeeInfo.lastName);
    formData.append('birthDate', employeeInfo.birthDate);
    formData.append('address', employeeInfo.address);
    formData.append('region', 'VN');
    formData.append('phoneNumber', employeeInfo.phoneNumber);
    formData.append('email', employeeInfo.email);

    formData.append('isBrandAdmin', !!employeeInfo.isBrandAdmin);
    if (stores.length > 0) {
      stores.forEach((store, index) => {
        formData.append(`stores[${index}].storeId`, store.storeId);
        formData.append(`stores[${index}].isManager`, store.isManager);
        formData.append(`stores[${index}].status`, store.status);
      });
    }

    return http
      .put(`/employees/${employeeInfo.id}`, formData, {
        headers: {
          brandId,
        },
      })
      .then((res) => {
        message.success('Update successfully.');
        onGetEmployees(pageIndex, pageSize);
        setUserInfoFormProps(INITIAL_DETAILS_FORM_PROPS);
      })
      .catch((err) => {
        message.error('Update failed.');
      });
  };

  const editUserInfoHandler = (formValues) => {
    const { item } = userInfoFormProps;
    console.log('item', item);
    setProcessing(true);
    const stores = item.stores.map((s) => ({
      storeId: s.store.id,
      isManager: s.isManager,
      status: s.status,
    }));

    const formData = new FormData();

    formData.append('code', item.code);
    formData.append('firstName', formValues.firstName);
    formData.append('lastName', formValues.lastName);
    formData.append('birthDate', formValues.birthDate.toISOString());
    formData.append('address', formValues.address);
    formData.append('region', 'VN');
    formData.append('phoneNumber', formValues.phoneNumber);
    formData.append('email', formValues.email);
    formData.append('status', item.status);
    if (formValues.photo != null) {
      formData.append('photo', formValues.photo[0].originFileObj);
    }
    formData.append('isBrandAdmin', !!formValues.isBrandAdmin);
    if (stores.length > 0) {
      stores.forEach((store, index) => {
        formData.append(`stores[${index}].storeId`, store.storeId);
        formData.append(`stores[${index}].isManager`, store.isManager);
        formData.append(`stores[${index}].status`, store.status);
      });
    }

    return http
      .put(`/employees/${item.id}`, formData)
      .then((res) => {
        message.success('Update successfully.');
        onGetEmployees(pageIndex, pageSize);
        setUserInfoFormProps(INITIAL_DETAILS_FORM_PROPS);
        setProcessing(false);
      })
      .catch((err) => {
        message.error('Update failed.');
        setProcessing(false);
      });
  };

  const storeManagerSwitchedHandler = (employeeInfo, storeId, checked) => {
    setSwitchManagerLoading(true);
    const stores = employeeInfo.stores.map((s) => ({
      storeId: s.store.id,
      isManager: s.store.id === storeId ? checked : s.isManager,
      status: s.status,
    }));

    const formData = new FormData();

    formData.append('code', employeeInfo.code);
    formData.append('firstName', employeeInfo.firstName);
    formData.append('lastName', employeeInfo.lastName);
    formData.append('birthDate', employeeInfo.birthDate);
    formData.append('address', employeeInfo.address);
    formData.append('region', 'VN');
    formData.append('phoneNumber', employeeInfo.phoneNumber);
    formData.append('email', employeeInfo.email);

    formData.append('isBrandAdmin', !!employeeInfo.isBrandAdmin);
    if (stores.length > 0) {
      stores.forEach((store, index) => {
        formData.append(`stores[${index}].storeId`, store.storeId);
        formData.append(`stores[${index}].isManager`, store.isManager);
        formData.append(`stores[${index}].status`, store.status);
      });
    }
    return http
      .put(`/employees/${employeeInfo.id}`, formData, {
        headers: {
          brandId,
        },
      })
      .then((res) => {
        setSwitchManagerLoading(false);
        message.success('Update successfully.');
        onGetEmployees(pageIndex, pageSize);
        setUserInfoFormProps(INITIAL_DETAILS_FORM_PROPS);
      })
      .catch((err) => {
        message.error('Update failed.');
      });
  };

  const createEmployeeSuccessHandler = () => {
    setFormProps(INITIAL_FORM_PROPS);
  };

  const addNewStoreHandler = (formValues) => {
    console.log('values', formValues);
    setProcessing(true);
    const { item } = employeeStoresFormProps;
    const { stores } = item;
    const updatedStores = [
      ...stores,
      {
        status: 1,
        isManager: !!formValues.isManager,
        store: {
          id: formValues.storeId,
        },
      },
    ];
    const formData = new FormData();

    formData.append('code', item.code);
    formData.append('firstName', item.firstName);
    formData.append('lastName', item.lastName);
    formData.append('birthDate', item.birthDate);
    formData.append('address', item.address);
    formData.append('region', 'VN');
    formData.append('phoneNumber', item.phoneNumber);
    formData.append('email', item.email);

    formData.append('isBrandAdmin', !!item.isBrandAdmin);
    if (updatedStores.length > 0) {
      updatedStores.forEach((s, index) => {
        formData.append(`stores[${index}].storeId`, s.store.id);
        formData.append(`stores[${index}].isManager`, s.isManager);
        formData.append(`stores[${index}].status`, s.status);
      });
    }

    return http
      .put(`/employees/${item.id}`, formData, {
        headers: {
          brandId,
        },
      })
      .then((res) => {
        message.success('Update successfully.');
        onGetEmployees(pageIndex, pageSize);
        employeeStoresForm.resetFields();
        setEmployeeStoresFormProps(INITIAL_DETAILS_FORM_PROPS);
        setProcessing(false);
      })
      .catch((err) => {
        message.error('Update failed.');
        setProcessing(false);
      });
  };

  useEffect(() => {
    onGetEmployees(querySearch);
  }, [onGetEmployees, querySearch]);

  const columns = [
    {
      dataIndex: 'code',
      title: 'Code',
      align: 'center',
      width: '14%',
    },
    {
      title: 'Full Name',
      align: 'center',
      width: '16%',
      render: (_, record) => {
        return (
          <div style={{ display: 'flex', marginLeft: '20%' }}>
            <Avatar
              size="large"
              src={record.photoUrl}
              style={{ marginRight: '10px' }}
            />
            <span
              style={{ padding: '10px' }}
            >{`${record.firstName} ${record.lastName}`}</span>
          </div>
        );
      },
    },
    {
      dataIndex: 'phoneNumber',
      title: 'Phone Number',
      align: 'center',
      width: '16%',
    },
    {
      dataIndex: 'email',
      title: 'Email',
      align: 'center',
      width: '16%',
    },
    {
      dataIndex: 'address',
      title: 'Address',
      align: 'center',
      width: '14%',
    },
    {
      dataIndex: 'status',
      title: 'Status',
      align: 'center',
      width: '10%',
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
      title: 'Actions',
      align: 'center',
      render: (_, record) => {
        var isActive = !!parseInt(record.status);

        return (
          <Row justify="center" gutter={8}>
            <Col>
              <Tooltip title="Edit Info">
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
              </Tooltip>
            </Col>
            <Col>
              <Tooltip placement="top" title="Add Store">
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    startAddingEmployeeStoreHandler(record);
                  }}
                  shape="circle"
                  size="large"
                  icon={<PlusOutlined />}
                />
              </Tooltip>
            </Col>
            <Col>
              <Tooltip
                title={`${
                  !!record.status ? 'Deactivate' : 'Activate'
                } employee`}
              >
                <Popconfirm
                  title={`Are you sure to ${
                    !!record.status ? 'deactivate' : 'activate'
                  } this user?`}
                  onConfirm={(e) => {
                    e.stopPropagation();
                    toggleEmployeeStatusHandler(record);
                  }}
                  onCancel={(e) => e.stopPropagation()}
                >
                  <Button
                    onClick={(e) => e.stopPropagation()}
                    shape="circle"
                    size="large"
                    danger={isActive}
                    icon={isActive ? <CloseOutlined /> : <CheckOutlined />}
                  />
                </Popconfirm>
              </Tooltip>
            </Col>
          </Row>
        );
      },
    },
  ];

  const handleOnChangeTable = (pagination, filters, sorters, extra) => {
    if (filters?.status?.length !== 1) {
      setQuerySearch(INITIAL_SEARCH);
    } else {
      setQuerySearch((prev) => ({
        ...prev,
        status: filters.status[0],
      }));
    }
  };

  const onSearch = (val) => {
    try {
      const query = queryString.stringify({
        name: val,
        brandId,
      });
      http
        .get(`/employees?${query}`, {
          headers: {
            brandId,
          },
        })
        .then((res) => {
          setEmployeeSearchList(res?.data.data);
        });
    } catch (error) {}
  };

  const onSelect = async (val, option) => {
    const { data } = await http.get(`/employees/${option.key}`, {
      headers: {
        brandId,
      },
    });
    setDetailsModalProps((prev) => ({
      ...prev,
      title: 'Employee Detail',
      visible: true,
      item: data,
    }));
  };

  return (
    <LayoutWrapper>
      <Header>
        <Title>EMPLOYEES</Title>
        <Search
          placeholder="Search employee by name"
          onSearch={debounce(onSearch, 240)}
          onSelect={onSelect}
        >
          {employeeSearchList.map((em) => (
            <AutoComplete.Option
              key={em.id}
              value={`${em.firstName} ${em.lastName}`}
            >
              <div style={{ display: 'flex' }}>
                <Avatar size="large" src={em.photoUrl} />
                <span
                  style={{ marginLeft: 10, marginTop: 10 }}
                >{`${em.firstName} ${em.lastName}`}</span>
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
          onClick={() => startCreatingHandler()}
        >
          Add New Employee
        </Button>
      </Header>
      <Button
        icon={<FileExcelOutlined />}
        style={{ background: '#f6ffed', color: '#52c41a' }}
        onClick={() => onDownloadEmployees()}
      >
        Download Report
      </Button>
      <Table
        loading={loading}
        rowKey="id"
        columns={columns}
        dataSource={employeeList.data}
        onChange={handleOnChangeTable}
        onRow={(data) => {
          return {
            onClick: () => {
              setDetailsModalProps((curr) => ({
                ...curr,
                item: data,
                title: 'Employee Details',
                visible: true,
              }));
            },
          };
        }}
        expandable={{
          rowExpandable: (record) =>
            record.stores.filter((s) => s.status !== 0).length > 0,
          expandedRowRender: (record) => {
            const employeeInfo = record;
            return (
              <>
                <Table
                  rowKey="id"
                  dataSource={record.stores.filter((s) => s.status !== 0)}
                  columns={[
                    {
                      dataIndex: 'storeCode',
                      title: 'Store Code',
                      align: 'center',
                      render: (_, record) => record.store.code,
                    },
                    {
                      dataIndex: 'storeName',
                      title: 'Store Name',
                      align: 'center',
                      render: (_, record) => record.store.name,
                    },
                    {
                      dataIndex: 'isManager',
                      title: 'Manager',
                      align: 'center',
                      render: (value, record) => {
                        return (
                          <Switch
                            disabled={!record.status}
                            loading={switchManagerLoading}
                            checked={value}
                            onChange={(checked) => {
                              storeManagerSwitchedHandler(
                                employeeInfo,
                                record.store.id,
                                checked
                              );
                            }}
                          />
                        );
                      },
                    },
                    {
                      dataIndex: 'storeId',
                      title: 'Remove',
                      align: 'center',
                      render: (value, record) => {
                        const isActive = !!parseInt(record.status);
                        return (
                          <Popconfirm
                            title="Are you sure to remove this store for this employee?"
                            onConfirm={() => {
                              employeeStoreRemovedHandler(
                                record.store.id,
                                employeeInfo
                              );
                            }}
                          >
                            <Button
                              disabled={!isActive}
                              shape="circle"
                              size="large"
                              danger
                              icon={<DeleteOutlined />}
                            />
                          </Popconfirm>
                        );
                      },
                    },
                  ]}
                />
              </>
            );
          },
        }}
        pagination={{
          current: pageIndex,
          total: employeeList.totalItems,
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
      <EmployeeForm
        processing={processing}
        visible={formProps.visible}
        title={formProps.title}
        onCancel={() => {
          setFormProps(INITIAL_FORM_PROPS);
        }}
        onSuccess={createEmployeeSuccessHandler}
      />
      <RemoveForm
        {...removeFormProps}
        loading={processing}
        onFinish={() => {
          toggleEmployeeStatusHandler(removeFormProps.item.id);
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
      <Modal
        confirmLoading={processing}
        visible={userInfoFormProps.visible}
        title="Update User Info"
        onOk={() => userInfoForm.submit()}
        onCancel={() => {
          setUserInfoFormProps(INITIAL_DETAILS_FORM_PROPS);
        }}
      >
        <Form
          form={userInfoForm}
          onFinish={(values) => {
            editUserInfoHandler(values);
          }}
        >
          <UserInfoForm
            editing={userInfoFormProps.item != null}
            onIsBrandAdminChanged={() => {}}
          />
        </Form>
      </Modal>
      <Modal
        confirmLoading={processing}
        visible={employeeStoresFormProps.visible}
        title={employeeStoresFormProps.title}
        onCancel={() => {
          employeeStoresForm.resetFields();
          setEmployeeStoresFormProps(INITIAL_DETAILS_FORM_PROPS);
        }}
        onOk={() => employeeStoresForm.submit()}
      >
        <Form
          form={employeeStoresForm}
          onFinish={(values) => {
            addNewStoreHandler(values);
          }}
        >
          <EmployeeStoreForm />
        </Form>
      </Modal>
      <EmployeeDetails
        {...detailsModalProps}
        onCancel={() => {
          setDetailsModalProps(INITIAL_DETAILS_FORM_PROPS);
        }}
      />
      {<Loading loading={success} text={'Processing your request...'} />}
    </LayoutWrapper>
  );
};

const mapStateToProps = (state) => ({
  employeeList: state.employee.employeeList,
  loading: state.employee.loading,

  success: state.employee.success,
});

const mapDispatchToProps = (dispatch) => ({
  onGetEmployees: (pageIndex, pageSize) =>
    dispatch(EmployeeActions.getEmployeesRequest(pageIndex, pageSize)),
  onToggleEmployeeStatus: (item, query) =>
    dispatch(EmployeeActions.toggleEmployeeStatusRequest(item, query)),
  onDownloadEmployees: () =>
    dispatch(EmployeeActions.downloadEmployeesRequest()),
});

export default connect(mapStateToProps, mapDispatchToProps)(EmployeesPage);
