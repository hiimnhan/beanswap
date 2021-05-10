import {
  DeleteOutlined,
  EditOutlined,
  FileExcelOutlined,
  PlusCircleFilled,
} from '@ant-design/icons';
import {
  Button,
  Col,
  Dropdown,
  Form,
  Menu,
  message,
  Row,
  Table,
  Tag,
  Typography,
} from 'antd';
import React, { useState, useEffect } from 'react';
import LayoutWrapper from '../../components/LayoutWrapper';
import VoucherFilter from '../../components/VoucherFilter';
import { Header, Title } from './styles';

import VoucherForm from '../../components/VoucherForm';
import { VoucherActions } from '../../redux/actions/voucher.actions';
import { connect } from 'react-redux';

import moment from 'moment';
import RemoveForm from '../../components/RemoveForm';
import Modal from 'antd/lib/modal/Modal';
import VoucherInfo from '../../components/VoucherForm/VoucherInfo';
import VoucherDate from '../../components/VoucherForm/VoucherDate';

import http from '../../configs/axios';
import { getItemLocalStorage } from '../../utils/storage.utils';
import { BRAND_ID_LOCALSTORAGE } from '../../constants/service';
import VoucherDetail from '../../components/VoucherDetail';
import { numberFormat } from '../../utils/format.utils';

const INITIAL_FORM_PROPS = {
  visible: false,
  title: '',
  item: null,
};

const INITIAL_REMOVE_FORM_PROPS = {
  visible: false,
  title: '',
  description: '',
  item: null,
};

const VOUCHER_DETAIL_FORM_PROPS = {
  item: null,
  visible: false,
  title: '',
};

const INITIAL_SEARCH = {
  pageIndex: 1,
  pageSize: 10,
};

const VoucherPage = ({
  onGetVouchers,
  loading,
  voucherList = {},
  onDeleteVoucher,
  onDownloadVouchers,
}) => {
  const [formProps, setFormProps] = useState(INITIAL_FORM_PROPS);
  const [removeFormProps, setRemoveFormProps] = useState(
    INITIAL_REMOVE_FORM_PROPS
  );
  const [voucherDetailFormProps, setVoucherDetailFormProps] = useState(
    VOUCHER_DETAIL_FORM_PROPS
  );
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize] = useState(10);
  const [querySearch, setQuerySearch] = useState(INITIAL_SEARCH);
  const [filtering, setFiltering] = useState(false);

  const [processing, setProcessing] = useState(false);

  const [voucherInfoForm] = Form.useForm();
  const [editInfoFormProps, setEditInfoFormProps] = useState(
    INITIAL_FORM_PROPS
  );
  const [voucherTimeRangeForm] = Form.useForm();
  const [editTimeRangeFormProps, setEditTimeRangeFormProps] = useState(
    INITIAL_FORM_PROPS
  );

  const brandId = getItemLocalStorage(BRAND_ID_LOCALSTORAGE);
  useEffect(() => {
    onGetVouchers(querySearch);
  }, [onGetVouchers, querySearch]);

  const startRemovingHandler = (item) => {
    setRemoveFormProps((curr) => ({
      ...curr,
      visible: true,
      title: (
        <Typography.Text type="danger">
          Are you sure to delete this store?
        </Typography.Text>
      ),
      description: `You are trying to delete voucher ${item.name}, it will deactivate this voucher.`,
      item,
    }));
  };

  const removeVoucherHandler = (id) => {
    onDeleteVoucher(id, querySearch);
    setRemoveFormProps(INITIAL_REMOVE_FORM_PROPS);
  };

  const startEditingHandler = () => {
    const title = 'Add New Voucher';
    setFormProps((curr) => ({
      ...curr,
      visible: true,
      title,
    }));
  };
  const onFinish = (value) => {
    setFiltering(true);
    const { purchaseDateRange, redeemDateRannge, type, status } = value;
    const query = {
      type,
      status,
      pageIndex,
      pageSize,
      startPurchaseDate: purchaseDateRange
        ? moment.utc(purchaseDateRange[0]).format()
        : undefined,
      endPurchaseDate: purchaseDateRange
        ? moment.utc(purchaseDateRange[1]).format()
        : undefined,
      startRedeemDate: redeemDateRannge
        ? moment.utc(redeemDateRannge[0]).format()
        : undefined,
      endRedeemDate: redeemDateRannge
        ? moment.utc(redeemDateRannge[1]).format()
        : undefined,
    };
    setQuerySearch(query);
  };

  const resetFilter = () => {
    setQuerySearch(INITIAL_SEARCH);
    setFiltering(false);
  };

  const startEditInfo = (item) => {
    let title = 'Edit Voucher Info';
    setEditInfoFormProps((curr) => ({
      ...curr,
      visible: true,
      title,
      item,
    }));
    voucherInfoForm.setFieldsValue({
      name: item.name,
      description: item.description,
      limit: item.limit,
      price: item.price,
      expireAfterPurchase: item.expireAfterPurchase,
      type: item.type,
    });
  };

  const editVoucherInfo = (formValues) => {
    setProcessing(true);
    const { item } = editInfoFormProps;

    const formData = new FormData();
    formData.append('name', formValues.name);
    formData.append('description', formValues.description);
    formData.append('limit', formValues.limit);
    formData.append('price', formValues.price);
    formData.append('expireAfterPurchase', formValues.expireAfterPurchase);
    formData.append('type', formValues.type);
    formData.append(
      'startPurchaseDate',
      moment.utc(item.startPurchaseDate).local().format()
    );
    formData.append(
      'endPurchaseDate',
      moment.utc(item.endPurchaseDate).local().format()
    );
    formData.append(
      'startRedeemDate',
      moment.utc(item.startRedeemDate).local().format()
    );
    formData.append(
      'endRedeemDate',
      moment.utc(item.endRedeemDate).local().format()
    );

    if (item.photo !== null) {
      formData.append('photo', formValues.photo[0].originFileObj);
    }
    return http
      .put(`/vouchers/${item.id}`, formData, {
        headers: {
          brandId,
        },
      })
      .then(() => {
        setProcessing(false);
        message.success('Update successfully!');
        onGetVouchers(querySearch);
        setEditInfoFormProps(INITIAL_FORM_PROPS);
      })
      .catch((error) => {
        setProcessing(false);
        message.error('Update error: ', error.message);
      });
  };

  const startEditTimeRange = (item) => {
    let title = 'Edit Time Range';
    setEditTimeRangeFormProps((curr) => ({
      ...curr,
      visible: true,
      title,
      item,
    }));

    voucherTimeRangeForm.setFieldsValue({
      purchaseDate: [
        moment(item.startPurchaseDate),
        moment(item.endPurchaseDate),
      ],
      redeemDate: [moment(item.startRedeemDate), moment(item.endRedeemDate)],
    });
  };

  const editTimeRange = (formValues) => {
    const { item } = editTimeRangeFormProps;
    setProcessing(true);

    const formData = new FormData();
    formData.append('name', item.name);
    formData.append('description', item.description);
    formData.append('limit', item.limit);
    formData.append('price', item.price);
    formData.append('expireAfterPurchase', item.expireAfterPurchase);
    formData.append('type', item.type);
    formData.append(
      'startPurchaseDate',
      moment.utc(formValues.purchaseDate[0]).local().format()
    );
    formData.append(
      'endPurchaseDate',
      moment.utc(formValues.purchaseDate[1]).local().format()
    );
    formData.append(
      'startRedeemDate',
      moment.utc(formValues.redeemDate[0]).local().format()
    );
    formData.append(
      'endRedeemDate',
      moment.utc(formValues.redeemDate[1]).local().format()
    );

    return http
      .put(`/vouchers/${item.id}`, formData, {
        headers: {
          brandId,
        },
      })
      .then(() => {
        setProcessing(false);
        message.success('Update voucher successfully!');
        onGetVouchers(querySearch);
        setEditTimeRangeFormProps(INITIAL_FORM_PROPS);
      })
      .catch((error) => {
        message.error('Update voucher error', error.message);
        setProcessing(false);
      });
  };

  const columns = [
    {
      dataIndex: 'name',
      align: 'center',
      title: 'NAME',
    },
    {
      dataIndex: 'purchaseDateRange',
      align: 'center',
      title: 'PURCHASE DATE',
      render: (_, record) => (
        <span>{`${moment(record.startPurchaseDate).format(
          'MMM Do YYYY'
        )} - ${moment(record.endPurchaseDate).format('MMM Do YYYY')}`}</span>
      ),
    },
    {
      dataIndex: 'redeemDateRange',
      align: 'center',
      title: 'REDEEM DATE',
      render: (_, record) => (
        <span>{`${moment(record.startRedeemDate).format(
          'MMM Do YYYY'
        )} - ${moment(record.endRedeemDate).format('MMM Do YYYY')}`}</span>
      ),
    },
    {
      dataIndex: 'limit',
      align: 'center',
      title: 'LIMIT',
      render: (_, record) => numberFormat(record.limit),
    },
    {
      dataIndex: 'expireAfterPurchase',
      align: 'center',
      title: 'EXPIRE TIME (days)',
    },
    {
      dataIndex: 'type',
      align: 'center',
      title: 'TYPE',
      render: (value) => {
        const colors = ['success', 'warning', 'error'];
        const types = ['Discount', 'Money', 'Product'];
        return <Tag color={colors[value]}>{types[value]}</Tag>;
      },
    },
    {
      dataIndex: 'price',
      align: 'center',
      title: 'PRICE',
    },
    {
      dataIndex: 'status',
      align: 'center',
      title: 'STATUS',
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
              <Dropdown
                overlay={
                  <Menu>
                    <Menu.Item
                      onClick={({ domEvent }) => {
                        domEvent.stopPropagation();
                        startEditInfo(record);
                      }}
                    >
                      Edit Info
                    </Menu.Item>
                    <Menu.Item
                      onClick={({ domEvent }) => {
                        domEvent.stopPropagation();
                        startEditTimeRange(record);
                      }}
                    >
                      Edit Time Range
                    </Menu.Item>
                  </Menu>
                }
              >
                <Button
                  shape="circle"
                  size="large"
                  type="primary"
                  icon={<EditOutlined />}
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                  }}
                />
              </Dropdown>
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
  return (
    <LayoutWrapper>
      <Header>
        <Title>VOUCHERS</Title>
      </Header>
      <Header>
        <div></div>
        <Button
          type="primary"
          size="large"
          icon={<PlusCircleFilled />}
          onClick={() => startEditingHandler()}
        >
          ADD NEW VOUCHER
        </Button>
      </Header>
      <Header>
        <div style={{ display: 'flex', flexDirection: 'row' }}>
          <VoucherFilter onFinish={onFinish} resetField={!filtering} />
          {filtering && (
            <Button style={{ marginLeft: 20 }} onClick={resetFilter}>
              Reset Filter
            </Button>
          )}
        </div>
      </Header>
      <Button
        icon={<FileExcelOutlined />}
        style={{ background: '#f6ffed', color: '#52c41a' }}
        onClick={() => onDownloadVouchers()}
      >
        Download Report
      </Button>
      <Table
        rowKey="id"
        dataSource={voucherList.data}
        columns={columns}
        loading={loading}
        onRow={(data) => {
          return {
            onClick: () => {
              setVoucherDetailFormProps((prev) => ({
                ...prev,
                item: data,
                title: data.name,
                visible: true,
              }));
            },
          };
        }}
        pagination={{
          current: pageIndex,
          total: voucherList.totalItems,
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
      <VoucherForm
        visible={formProps.visible}
        title={formProps.title}
        onCancel={() => setFormProps(INITIAL_FORM_PROPS)}
      />
      <RemoveForm
        {...removeFormProps}
        loading={loading}
        onFinish={() => {
          removeVoucherHandler(removeFormProps.item.id);
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
        visible={editInfoFormProps.visible}
        title={editInfoFormProps.title}
        onOk={() => voucherInfoForm.submit()}
        onCancel={() => setEditInfoFormProps(INITIAL_FORM_PROPS)}
      >
        <Form
          form={voucherInfoForm}
          onFinish={(values) => editVoucherInfo(values)}
        >
          <VoucherInfo />
        </Form>
      </Modal>
      <Modal
        visible={editTimeRangeFormProps.visible}
        title={editTimeRangeFormProps.title}
        onOk={() => voucherTimeRangeForm.submit()}
        onCancel={() => setEditTimeRangeFormProps(INITIAL_FORM_PROPS)}
      >
        <Form
          form={voucherTimeRangeForm}
          onFinish={(values) => editTimeRange(values)}
        >
          <VoucherDate form={voucherTimeRangeForm} />
        </Form>
      </Modal>
      <VoucherDetail
        item={voucherDetailFormProps.item}
        visible={voucherDetailFormProps.visible}
        title={voucherDetailFormProps.title}
        onCancel={() => setVoucherDetailFormProps(VOUCHER_DETAIL_FORM_PROPS)}
      />
    </LayoutWrapper>
  );
};

const mapStateToProps = (state) => ({
  loading: state.voucher.loading,
  voucherList: state.voucher.voucherList,
});

const mapDispatchToProps = (dispatch) => ({
  onGetVouchers: (query) => dispatch(VoucherActions.getVouchersRequest(query)),
  onDeleteVoucher: (id, query) =>
    dispatch(VoucherActions.deleteVoucherRequest(id, query)),
  onDownloadVouchers: () => dispatch(VoucherActions.downloadVouchersRequest()),
});

export default connect(mapStateToProps, mapDispatchToProps)(VoucherPage);
