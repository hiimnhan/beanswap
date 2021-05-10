import {
  CalendarOutlined,
  DeleteOutlined,
  DollarOutlined,
  DollarTwoTone,
  EditOutlined,
  FormOutlined,
  GiftOutlined,
  GoldOutlined,
  MessageOutlined,
  SendOutlined,
  TransactionOutlined,
} from '@ant-design/icons';
import {
  Button,
  Card,
  Col,
  Form,
  Image,
  Input,
  message,
  Modal,
  Result,
  Row,
  Table,
  Tabs,
  Tag,
  Typography,
} from 'antd';
import React, { useState, useEffect, useRef } from 'react';
import LayoutWrapper from '../../components/LayoutWrapper';
import RuleForm from '../../components/RuleForm';
import { Header, Title } from './styles';
import http from '../../configs/axios';
import { RuleActions } from '../../redux/actions/rule.actions';
import { connect } from 'react-redux';
import RuleFilter from '../../components/RuleFilter';
import moment from 'moment';
import RuleInfo from '../../components/RuleForm/RuleInfo';

import { PayPalButtons, FUNDING } from '@paypal/react-paypal-js';

import BeanIcon from '../../assets/images/bean-icon.png';
import './styles.css';
import {
  convertUSDBean,
  currencyFormat,
  numberFormat,
} from '../../utils/format.utils';
import { BrandActions } from '../../redux/actions/brand.actions';
import Loading from '../../components/Loading';
import SendBeanForm from '../../components/SendBeanForm';
import { getItemLocalStorage } from '../../utils/storage.utils';
import RemoveForm from '../../components/RemoveForm';
import { BRAND_ID_LOCALSTORAGE } from '../../constants/service';
import { DATE_FORMAT, DATE_TIME_FORMAT } from '../../constants/format';
import { store } from '../../redux/store';

const INITIAL_FORM_PROPS = {
  visible: false,
  title: '',
  item: null,
};

const INITIAL_QUERY = {
  pageSize: 8,
  pageIndex: 1,
};

const INITIAL_REMOVE_FORM_PROPS = {
  visible: false,
  title: '',
  description: '',
  item: null,
};

const typeList = ['One Time', 'Day(s)', 'Week(s)', 'Month(s)', 'Year(s)'];
const colorList = ['error', 'warning', 'success'];
const messageList = ['Disabled', 'Processing', 'Finished'];

const TransferPage = ({
  onGetRules,
  ruleList = {},
  loading,
  onGetInvoices,
  getInvoicesLoading,
  invoices = {},
  onGetBalance,
  balance = 0,
}) => {
  const { TabPane } = Tabs;
  const [formProps, setFormProps] = useState(INITIAL_FORM_PROPS);
  const [sendBeanFormProps, setSendBeanFormProps] = useState(
    INITIAL_FORM_PROPS
  );
  const [removeFormProps, setRemoveFormProps] = useState(
    INITIAL_REMOVE_FORM_PROPS
  );
  const [querySearch, setQuerySearch] = useState(INITIAL_QUERY);
  const [pageSize] = useState(8);
  const [pageIndex, setPageIndex] = useState(1);
  const [filtering, setFiltering] = useState(false);
  const [showModalInfo, setShowModalInfo] = useState(false);
  const [showModalApplied, setShowModalApplied] = useState(false);
  const [infoForm] = Form.useForm();
  const [appliedForm] = Form.useForm();
  const [sendBeanForm] = Form.useForm();
  const [sendBeanLoading, setSendBeanLoading] = useState(false);
  const [showSent, setShowSent] = useState(false);
  const [sentTransaction, setSentTransaction] = useState(null);
  const [itemEditting, setItemEditting] = useState(null);
  const [currentAmount, setCurrentAmount] = useState(0);
  const [processing, setProcessing] = useState(false);
  const [deleteProcessing, setDeleteProcessing] = useState(false);
  const [queryInvoices, setQueryInvoices] = useState({
    ...INITIAL_QUERY,
  });
  const [pageIndexInvoice, setPageIndexInvoice] = useState(1);
  const beanExchanged = useRef(0);
  const invoiceId = useRef(null);
  const [showResult, setShowResult] = useState(false);
  const [invoice, setInvoice] = useState(null);

  const brandId = getItemLocalStorage(BRAND_ID_LOCALSTORAGE);
  const { walletAddress } = store.getState().brand?.currentBrand;
  useEffect(() => {
    onGetRules(querySearch);
  }, [onGetRules, querySearch]);

  useEffect(() => {
    onGetInvoices(queryInvoices);
  }, [onGetInvoices, queryInvoices]);

  const startAddRule = () => {
    const title = 'Add New Rule';
    setFormProps((prev) => ({
      ...prev,
      visible: true,
      title,
    }));
  };

  const onFinishFilter = (values) => {
    setFiltering(true);
    const { dateRange, intervalType, status } = values;
    const query = {
      intervalType,
      status,
      startDate: dateRange ? moment.utc(dateRange[0]).format() : undefined,
      endDate: dateRange ? moment.utc(dateRange[1]).format() : undefined,
    };
    setQuerySearch(query);
  };

  const onResetFilter = () => {
    setQuerySearch(INITIAL_QUERY);
    setFiltering(false);
  };

  const startRemovingHandler = (item) => {
    setRemoveFormProps((prev) => ({
      ...prev,
      item,
      visible: true,
      title: (
        <Typography.Text type="danger">
          Are you sure to delete this rule?
        </Typography.Text>
      ),
      description: `You are trying to delete rule ${item.name}, it will deactivate this rule.`,
    }));
  };

  const onDeleteRule = async (id) => {
    setDeleteProcessing(true);
    try {
      await http.delete(`/rules/${id}`);
      setDeleteProcessing(false);
      message.success('Delete rule successfully!');
      onGetRules(INITIAL_QUERY);
      setRemoveFormProps(INITIAL_FORM_PROPS);
    } catch (error) {
      message.error('Error: ', error?.response?.data?.errors[0]);
      setDeleteProcessing(false);
      setRemoveFormProps(INITIAL_FORM_PROPS);
    }
  };

  const onEditRule = (section, item) => {
    if (section === 'info') {
      setShowModalInfo(true);
      setShowModalApplied(false);
      setItemEditting(item);
      infoForm.setFieldsValue({
        ...item,
        date: [moment(item.startDate), moment(item.endDate)],
      });
    } else if (section === 'storeApplied') {
      setShowModalInfo(false);
      setShowModalApplied(true);
      setItemEditting(item);
    } else {
      setShowModalApplied(false);
      setShowModalInfo(false);
    }
  };

  const onEditRuleInfo = async (formValues) => {
    try {
      const data = {
        name: formValues.name,
        description: formValues.description,
        intervalType: formValues.intervalType,
        interval: formValues.interval,
        runNow: formValues.runNow,
        startDate: moment(formValues?.date[0]),
        endDate: moment(formValues?.date[1]),
      };
      await http.put(`/rules/${itemEditting?.id}`, data, {
        headers: {
          brandId,
        },
      });
      message.success('Edit rule info successfully!');
      infoForm.resetFields();
      setShowModalInfo(false);
      onGetRules(INITIAL_QUERY);
    } catch (error) {
      message.error(`Error: ${error?.response?.data?.errors[0]}`);
    }
  };

  const onChangeAmount = (e) => {
    const { value } = e.target;
    if (!Number(value) && !Number.isInteger(value) && value.length > 0) return;
    if (value.length === 0) {
      setCurrentAmount(0);
      beanExchanged.current = 0;
      return;
    }
    setCurrentAmount(parseInt(value));
    beanExchanged.current = convertUSDBean(parseInt(value), true);
  };
  const onChangeBean = (e) => {
    console.log('value', e.target.value);
    const { value } = e.target;
    if (!Number(value) && !Number.isInteger(value) && value.length > 0) return;
    if (value.length === 0) {
      setCurrentAmount(0);
      beanExchanged.current = 0;
      return;
    }
    beanExchanged.current = parseInt(value);
    setCurrentAmount(convertUSDBean(parseInt(value), false));
  };

  const createOrder = async (data, actions) => {
    try {
      const { data } = await http.post(
        '/invoices',
        {
          brandId,
          amount: beanExchanged.current,
        },
        {
          headers: {
            brandId,
          },
        }
      );
      invoiceId.current = data.id;
      return data.orderId;
    } catch (error) {
      message.error(`Error: ${error.response.data.errors[0]}`);
    }
  };
  const captureOrder = async (data, actions) => {
    setProcessing(true);
    try {
      const { data } = await http.put(
        `/invoices/${invoiceId.current}`,
        {
          status: 1,
        },
        {
          headers: {
            brandId,
          },
        }
      );
      console.log('data', data);
      setInvoice(data);
      setProcessing(false);
      // message.success('Purchase succesfully!');
      onGetBalance(walletAddress);
      setShowResult(true);
      onGetInvoices(queryInvoices);
      const errorDetail = Array.isArray(data.details) && data.details[0];
      if (errorDetail && errorDetail.issue === 'INSTRUMENT_DECLINED') {
        return actions.restart();
      }
      if (errorDetail) {
        message.error(
          `Sorry, your transaction cannot be processed: ${errorDetail.description}`
        );
      }
    } catch (error) {}
  };

  const invoiceColumns = [
    {
      dataIndex: 'code',
      align: 'center',
      title: 'Code',
    },
    {
      dataIndex: 'orderId',
      align: 'center',
      title: 'Order Id',
    },
    {
      dataIndex: 'price',
      align: 'center',
      title: `Price`,
      sorter: true,
      render: (_, record) => (
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          <span style={{ marginRight: 10 }}>
            {currencyFormat(record.price)}
          </span>
        </div>
      ),
    },
    {
      dataIndex: 'amount',
      alignItems: 'center',
      title: 'Amount',
      sorter: true,
      render: (_, record) => (
        <div style={{ display: 'flex' }}>
          <span style={{ marginRight: 10 }}>{numberFormat(record.amount)}</span>
          <Image src={BeanIcon} width={20} height={20} preview={false} />
        </div>
      ),
    },
    {
      dataIndex: 'createdDate',
      alignItems: 'center',
      title: 'Purchased Date',
      sorter: true,
      sortDirections: ['descend'],
      render: (_, record) => {
        return moment(record.createdDate).local().format(DATE_TIME_FORMAT);
      },
    },
  ];

  const ruleColumns = [
    {
      dataIndex: 'name',
      align: 'center',
      title: 'Name',
    },
    {
      dataIndex: 'startDate',
      align: 'center',
      title: 'Start Date',
      render: (_, record) =>
        moment.utc(record.startDate).local().format(DATE_FORMAT),
    },
    {
      dataIndex: 'endDate',
      align: 'center',
      title: 'End Date',
      render: (_, record) =>
        moment.utc(record.endDate).local().format(DATE_FORMAT),
    },
    {
      dataIndex: 'interval',
      align: 'center',
      title: 'Interval',
      render: (_, record) => {
        if (record.intervalType === 1) return 'One Time';
        return `${record.interval} ${typeList[record.intervalType - 1]}`;
      },
    },
    {
      dataIndex: 'status',
      align: 'center',
      title: 'Status',
      render: (_, record) => (
        <Tag color={colorList[record.status]}>{messageList[record.status]}</Tag>
      ),
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
                  onEditRule('info', record);
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

  const handleChangeTable = (pagination, filters, sorter) => {
    const { field, order } = sorter;
    setQueryInvoices((prevQuery) => ({
      ...prevQuery,
      sort: `${field} ${order === 'ascend' ? 'asc' : 'desc'}`,
    }));
  };

  const startSendBean = () => {
    const title = 'Send Beans To Employee';
    setSendBeanFormProps((prev) => ({
      ...prev,
      title,
      visible: true,
    }));
  };

  const sendBeanToEmp = (values) => {
    setSendBeanLoading(true);
    const body = {
      receivers: [
        {
          employeeId: values.employeeId,
          amount: values.amount,
        },
      ],
      message: values.message,
      type: 3,
    };
    http
      .post('/bonuses', body, {
        headers: {
          brandId,
        },
      })
      .then((res) => {
        setSendBeanLoading(false);
        onGetBalance(walletAddress);
        setSentTransaction(res.data);
        sendBeanForm.resetFields();
        setShowSent(true);
      })
      .catch((error) => {
        setSendBeanLoading(false);
        message.error(`Error: ${error.response?.data?.errors[0]}`);
        sendBeanForm.resetFields();
      });
  };

  return (
    <LayoutWrapper>
      <Header style={{ marginBottom: 50 }}>
        <Title>TRANSFER</Title>
      </Header>
      <Header>
        <Button icon={<GiftOutlined />} onClick={startSendBean} type="dashed">
          Send Beans To Employee
        </Button>
      </Header>
      <Tabs defaultActiveKey="1" tabPosition="left" style={{ height: '100vh' }}>
        <TabPane tab="Set Rules" key="1">
          <div>
            <Header>
              <Button
                icon={<FormOutlined />}
                type="primary"
                onClick={startAddRule}
              >
                Add New Rule
              </Button>
            </Header>
          </div>
          <Header>
            <div style={{ display: 'flex', flexDirection: 'row' }}>
              <RuleFilter onFinish={onFinishFilter} resetFields={!filtering} />
              {filtering && (
                <Button style={{ marginLeft: 20 }} onClick={onResetFilter}>
                  Reset Filter
                </Button>
              )}
            </div>
          </Header>

          <Table
            style={{ maxHeight: '95%' }}
            rowKey="id"
            columns={ruleColumns}
            dataSource={ruleList.data}
            loading={loading}
            pagination={{
              current: pageIndex,
              pageSize: pageSize,
              total: ruleList?.totalItems,
              onChange: (page) => {
                setPageIndex(page);
                setQuerySearch((prevQuery) => ({
                  ...prevQuery,
                  pageIndex: page,
                }));
              },
            }}
          />
        </TabPane>
        <TabPane key="2" tab="Purchase Beans">
          <div
            style={{
              width: '100%',
              display: 'flex',

              alignItems: 'center',
            }}
          >
            <Card
              title="Purchase Beans"
              style={{ width: 400 }}
              actions={[
                <PayPalButtons
                  fundingSource={FUNDING.PAYPAL}
                  className="paypal-button"
                  createOrder={createOrder}
                  onApprove={captureOrder}
                />,
              ]}
            >
              <div>
                <span
                  style={{
                    fontWeight: 'bold',
                    marginBottom: 10,
                    display: 'inline-block',
                  }}
                >
                  Amount
                </span>
                <Input
                  suffix={<DollarTwoTone twoToneColor="#f2911b" />}
                  defaultValue={currentAmount}
                  value={currentAmount}
                  onChange={onChangeAmount}
                />
              </div>

              <div>
                <span
                  style={{
                    fontWeight: 'bold',
                    marginBottom: 10,
                    marginTop: 10,
                    display: 'inline-block',
                  }}
                >
                  Bean
                </span>
                <Input
                  suffix={
                    <Image
                      src={BeanIcon}
                      width={20}
                      height={20}
                      preview={false}
                    />
                  }
                  defaultValue={beanExchanged.current}
                  value={beanExchanged.current}
                  onChange={onChangeBean}
                />
              </div>
            </Card>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <span style={{ marginBottom: 20, fontWeight: 'bold' }}>
                Invoices History
              </span>
              <Table
                style={{ marginLeft: '50px' }}
                columns={invoiceColumns}
                dataSource={invoices.data}
                loading={getInvoicesLoading}
                onChange={handleChangeTable}
                pagination={{
                  current: pageIndexInvoice,
                  total: invoices.totalItems,
                  pageSize: pageSize,
                  onChange: (page) => {
                    setPageIndexInvoice(page);
                    setQueryInvoices((prevQuery) => ({
                      ...prevQuery,
                      pageIndex: page,
                    }));
                  },
                }}
                rowKey="id"
              />
            </div>
          </div>
        </TabPane>
      </Tabs>
      <RuleForm
        {...formProps}
        querySearch={querySearch}
        onCancel={() => setFormProps(INITIAL_FORM_PROPS)}
      />
      <Modal
        title="Edit Rule Info"
        visible={showModalInfo}
        onOk={() => infoForm.submit()}
        onCancel={() => setShowModalInfo(false)}
      >
        <Form
          style={{ margin: '16px 0' }}
          layout="vertical"
          onFinish={onEditRuleInfo}
          form={infoForm}
        >
          <RuleInfo />
        </Form>
      </Modal>
      <Modal
        {...sendBeanFormProps}
        confirmLoading={sendBeanLoading}
        okText="Send"
        okButtonProps={{
          icon: <SendOutlined />,
        }}
        onCancel={() => {
          setSendBeanFormProps(INITIAL_FORM_PROPS);
          sendBeanForm.resetFields();
        }}
        onOk={() => {
          sendBeanForm.submit();
        }}
      >
        <SendBeanForm
          form={sendBeanForm}
          onFinish={(values) => sendBeanToEmp(values)}
        />
      </Modal>
      {<Loading loading={processing} text={'Processing your transaction...'} />}
      <RemoveForm
        {...removeFormProps}
        loading={deleteProcessing}
        onFinish={() => {
          onDeleteRule(removeFormProps.item.id);
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
      <Modal visible={showResult} footer={null}>
        <Result
          status="success"
          title="Purchase Success"
          subTitle={`Order ID: ${invoice?.orderId}`}
          extra={
            <div>
              <div className="invoice-row-container">
                <div className="invoice-label">
                  <CalendarOutlined style={{ width: 20, height: 20 }} />
                  <span style={{ marginLeft: 10 }}>Created Date:</span>
                </div>
                <div>
                  {moment
                    .utc(invoice?.createdDate)
                    .local()
                    .format(DATE_TIME_FORMAT)}
                </div>
              </div>
              <div className="invoice-row-container">
                <div className="invoice-label">
                  <GoldOutlined style={{ width: 20, height: 20 }} />
                  <span style={{ marginLeft: 10 }}>Amount:</span>
                </div>
                <div className="invoice-label">
                  <span>{numberFormat(invoice?.amount)}</span>
                  <Image
                    src={BeanIcon}
                    width={16}
                    height={16}
                    preview={false}
                  />
                </div>
              </div>
              <div className="invoice-row-container">
                <div className="invoice-label">
                  <DollarOutlined style={{ width: 20, height: 20 }} />
                  <span style={{ marginLeft: 10 }}>Price:</span>
                </div>
                <div className="invoice-label">
                  <span>{currencyFormat(invoice?.price)}</span>
                </div>
              </div>
              <div className="invoice-row-container">
                <div className="invoice-label">
                  <TransactionOutlined style={{ width: 20, height: 20 }} />
                  <span style={{ marginLeft: 10 }}>Balance:</span>
                </div>
                <div className="invoice-label">
                  <span>{numberFormat(balance)}</span>
                  <Image
                    src={BeanIcon}
                    width={16}
                    height={16}
                    preview={false}
                  />
                </div>
              </div>
              <Button type="primary" onClick={() => setShowResult(false)}>
                Close
              </Button>
            </div>
          }
        />
      </Modal>
      <Modal visible={showSent} footer={null}>
        <Result
          status="success"
          title="Send Success"
          extra={
            <div>
              <div className="invoice-row-container">
                <div className="invoice-label">
                  <CalendarOutlined style={{ width: 20, height: 20 }} />
                  <span style={{ marginLeft: 10 }}>Created Date:</span>
                </div>
                <div>
                  {moment
                    .utc(sentTransaction?.createdDate)
                    .local()
                    .format(DATE_TIME_FORMAT)}
                </div>
              </div>
              <div className="invoice-row-container">
                <div className="invoice-label">
                  <GoldOutlined style={{ width: 20, height: 20 }} />
                  <span style={{ marginLeft: 10 }}>Amount:</span>
                </div>
                <div className="invoice-label">
                  <span>
                    {sentTransaction &&
                      numberFormat(sentTransaction?.receivers[0]?.amount)}
                  </span>
                  <Image
                    src={BeanIcon}
                    width={16}
                    height={16}
                    preview={false}
                  />
                </div>
              </div>
              <div className="invoice-row-container">
                <div className="invoice-label">
                  <GoldOutlined style={{ width: 20, height: 20 }} />
                  <span style={{ marginLeft: 10 }}>Fee:</span>
                </div>
                <div className="invoice-label">
                  <span>
                    {sentTransaction &&
                      numberFormat(sentTransaction?.receivers[0]?.fee)}
                  </span>
                  <Image
                    src={BeanIcon}
                    width={16}
                    height={16}
                    preview={false}
                  />
                </div>
              </div>
              <div className="invoice-row-container">
                <div className="invoice-label">
                  <TransactionOutlined style={{ width: 20, height: 20 }} />
                  <span style={{ marginLeft: 10 }}>Balance:</span>
                </div>
                <div className="invoice-label">
                  <span>{numberFormat(balance)}</span>
                  <Image
                    src={BeanIcon}
                    width={16}
                    height={16}
                    preview={false}
                  />
                </div>
              </div>
              <div className="invoice-row-container">
                <div className="invoice-label">
                  <MessageOutlined style={{ width: 20, height: 20 }} />
                  <span style={{ marginLeft: 10 }}>Message:</span>
                </div>
                <div className="invoice-label">
                  <span>{sentTransaction?.message}</span>
                </div>
              </div>
              <Button type="primary" onClick={() => setShowSent(false)}>
                Close
              </Button>
            </div>
          }
        />
      </Modal>
    </LayoutWrapper>
  );
};

const mapStateToProps = (state) => ({
  ruleList: state.rule.ruleList,
  loading: state.rule.loading,
  invoices: state.brand.invoices,
  getInvoicesLoading: state.brand.loading,
  balance: state.brand.balance,
});

const mapDispatchToProps = (dispatch) => ({
  onGetRules: (query) => dispatch(RuleActions.getRulesRequest(query)),
  onGetInvoices: (query) => dispatch(BrandActions.getInvoicesRequest(query)),
  onGetBalance: (address) => dispatch(BrandActions.getBalanceRequest(address)),
});

export default connect(mapStateToProps, mapDispatchToProps)(TransferPage);
