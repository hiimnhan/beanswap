import { GiftOutlined, ShopOutlined, TeamOutlined } from '@ant-design/icons';
import { Avatar, Card, Image, Statistic, Timeline } from 'antd';
import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { appColors } from '../../assets/styles/colors';

import LayoutWrapper from '../../components/LayoutWrapper';
import { BrandActions } from '../../redux/actions/brand.actions';
import BeanIcon from '../../assets/images/bean-icon.png';
import { ResponsivePie } from '@nivo/pie';
import './styles.css';

import { VoucherActions } from '../../redux/actions/voucher.actions';
import { StoreActions } from '../../redux/actions/store.actions';
import moment from 'moment';
import { EmployeeActions } from '../../redux/actions/employee.actions';
import { getItemLocalStorage } from '../../utils/storage.utils';
import { BRAND_ID_LOCALSTORAGE } from '../../constants/service';
import { DATE_TIME_FORMAT } from '../../constants/format';
import NoData from '../../assets/images/empty.png';
import { numberFormat } from '../../utils/format.utils';

const pieList = [
  {
    label: 'Discount',
    color: 'hsl(174, 70%, 50%)',
  },
  {
    label: 'Money',
    color: 'hsl(207, 70%, 50%)',
  },
  {
    label: 'Product',
    color: 'hsl(115, 70%, 50%)',
  },
];
const DashboardPage = ({
  onGetRedemptions,
  redemptions = {},
  onGetEmloyeeBonuses,
  employeeBonuses = {},
  employeeBonusesLoading = false,
  balance = 0,
  onGetStores,
  stores = {},
  onGetStoreBonuses,
  storeBonuses = {},
  storeBonusesLoading,
  onGetEmployees,
  employees = {},
  onGetVouchers,
  vouchers = {},
}) => {
  const { data = [] } = redemptions;
  const brandId = getItemLocalStorage(BRAND_ID_LOCALSTORAGE);
  const statistics = Object.values(
    data.reduce((a, { type }) => {
      a[type] = a[type] || { type, count: 0 };
      a[type].count++;
      return a;
    }, Object.create(null))
  );

  const pieData = statistics.map((stat) => ({
    id: pieList[stat.type].label,
    value: stat.count,
    label: pieList[stat.type].label,
    color: pieList[stat.type].color,
  }));

  useEffect(() => {
    onGetRedemptions({
      status: 1,
    });
  }, [onGetRedemptions]);

  useEffect(() => {
    onGetEmloyeeBonuses();
  }, [onGetEmloyeeBonuses]);

  useEffect(() => {
    onGetStores({
      brandId,
    });
  }, [onGetStores, brandId]);

  useEffect(() => {
    onGetEmployees({
      brandId,
    });
  }, [onGetEmployees, brandId]);

  useEffect(() => {
    onGetVouchers({
      brandId,
    });
  }, [onGetVouchers, brandId]);

  useEffect(() => {
    onGetStoreBonuses({
      brandId,
      fields: 'store, rule',
    });
  }, [onGetStoreBonuses, brandId]);

  return (
    <LayoutWrapper>
      <div className="grid-layout">
        <div className="grid-item">
          <Statistic
            title="Stores"
            value={stores.totalItems}
            prefix={<ShopOutlined style={{ color: appColors.yellow }} />}
          />
        </div>
        <div className="grid-item">
          <Statistic
            title="Employees"
            value={employees.totalItems}
            prefix={<TeamOutlined style={{ color: appColors.blue }} />}
          />
        </div>
        <div className="grid-item">
          <Statistic
            title="Vouchers"
            value={vouchers.totalItems}
            prefix={<GiftOutlined style={{ color: appColors.red }} />}
          />
        </div>
        <div className="grid-item">
          <Statistic
            title="Beans"
            value={balance}
            prefix={
              <Image src={BeanIcon} width={25} height={25} preview={false} />
            }
          />
        </div>
        <div className="grid-item">
          <h1 style={{ marginTop: 40, fontWeight: 'bold' }}>
            Voucher Purchased
          </h1>
          {pieData.length === 0 && (
            <Image src={NoData} width={150} height={150} preview={false} />
          )}
          {pieData.length !== 0 && (
            <ResponsivePie
              data={pieData}
              margin={{ top: 10, right: 40, bottom: 100, left: 40 }}
              innerRadius={0.6}
              padAngle={4}
              cornerRadius={3}
              colors={{ scheme: 'paired' }}
              borderWidth={1}
              borderColor={{ from: 'color', modifiers: [['darker', 0.2]] }}
              enableRadialLabels={false}
              slicesLabelsSkipAngle={0}
              slicesLabelsTextColor="#333333"
              sliceLabel={(d) => {
                const result = Math.floor(
                  (d.value / redemptions.totalItems) * 100
                );

                return <tspan>{`${result}%`}</tspan>;
              }}
              animate={true}
              motionStiffness={90}
              motionDamping={15}
              legends={[
                {
                  anchor: 'bottom',
                  direction: 'row',
                  translateY: 30,
                  itemDirection: 'top-to-bottom',
                  itemWidth: 50,
                  itemHeight: 18,
                  itemTextColor: '#999',
                  symbolSize: 18,
                  symbolShape: 'circle',
                  effects: [
                    {
                      on: 'hover',
                      style: {
                        itemTextColor: '#000',
                      },
                    },
                  ],
                },
              ]}
            />
          )}
        </div>
      </div>
      <div className="grid-layout">
        <div className="grid-item-table">
          <Card
            loading={employeeBonusesLoading}
            className="item"
            title="Beans To Employees"
            style={{ width: '100%' }}
            bodyStyle={{ maxHeight: 280, overflow: 'auto' }}
          >
            {employeeBonuses?.totalItems === 0 && (
              <div
                style={{
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'center',
                }}
              >
                <Image src={NoData} width={150} height={150} preview={false} />
              </div>
            )}
            {employeeBonuses?.totalItems !== 0 && (
              <Timeline mode="left">
                {employeeBonuses?.data?.map((bo) => (
                  <Timeline.Item
                    key={bo?.id}
                    label={moment
                      .utc(bo?.createdDate)
                      .local()
                      .format(DATE_TIME_FORMAT)}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                      }}
                    >
                      {`Send ${numberFormat(bo?.receivers[0].amount)}`}
                      <Image
                        src={BeanIcon}
                        width={20}
                        height={20}
                        preview={false}
                      />
                      <Avatar
                        style={{ marginRight: 5, marginLeft: 5 }}
                        src={bo.receivers[0]?.receiver.photoUrl}
                      />
                      {`${bo.receivers[0]?.receiver.firstName} ${bo.receivers[0]?.receiver.lastName} `}
                    </div>
                    <div>{`with message: "${bo.message}"`}</div>
                  </Timeline.Item>
                ))}
              </Timeline>
            )}
          </Card>
        </div>
        <div className="grid-item-table">
          <Card
            loading={storeBonusesLoading}
            className="item"
            title="Store Bonuses"
            style={{ width: '100%' }}
            bodyStyle={{ maxHeight: 280, overflow: 'auto' }}
          >
            {storeBonuses?.totalItems === 0 && (
              <div
                style={{
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'center',
                }}
              >
                <Image src={NoData} width={150} height={150} preview={false} />
              </div>
            )}
            {storeBonuses?.totalItems !== 0 && (
              <Timeline mode="left">
                {storeBonuses?.data?.map((bo) => (
                  <Timeline.Item
                    key={bo?.id}
                    label={
                      <div>
                        <div>
                          {moment
                            .utc(bo?.createdDate)
                            .local()
                            .format(DATE_TIME_FORMAT)}
                        </div>
                        <span style={{ color: '#00000073' }}>
                          {bo?.rule.name}
                        </span>
                      </div>
                    }
                  >
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      {`Send ${numberFormat(bo?.amount)}`}
                      <Image
                        src={BeanIcon}
                        width={20}
                        height={20}
                        preview={false}
                      />
                    </div>
                    <div>
                      <Avatar
                        style={{ marginRight: 5 }}
                        src={bo.store.photoUrl}
                      />
                      {`${bo.store.name} `}
                    </div>
                  </Timeline.Item>
                ))}
              </Timeline>
            )}
          </Card>
        </div>
      </div>
    </LayoutWrapper>
  );
};

const mapStateToProps = (state) => ({
  currentBrand: state.brand.currentBrand,
  redemptions: state.voucher.redemptions,
  storeBonuses: state.store.bonuses,
  storeBonusesLoading: state.store.bonusLoading,
  balance: state.brand.balance,
  employeeBonuses: state.employee.bonuses,
  employeeBonusesLoading: state.employee.bonusLoading,
  stores: state.store.storeList,
  storeLoading: state.store.loading,
  employees: state.employee.employeeList,
  employeeLoading: state.employee.loading,
  vouchers: state.voucher.voucherList,
  voucherLoading: state.voucher.loading,
});

const mapDispatchToProps = (dispatch) => ({
  onGetBrandById: (id, query) =>
    dispatch(BrandActions.getBrandByIdRequest(id, query)),
  onGetRedemptions: (query) =>
    dispatch(VoucherActions.getRedemptionRequest(query)),
  onGetStoreBonuses: (query) =>
    dispatch(StoreActions.getStoreBonusRequest(query)),
  onGetEmloyeeBonuses: () =>
    dispatch(EmployeeActions.getEmployeeBonusesRequest()),
  onGetStores: (query) => dispatch(StoreActions.getStoresRequest(query)),
  onGetVouchers: (query) => dispatch(VoucherActions.getVouchersRequest(query)),
  onGetEmployees: (query) =>
    dispatch(EmployeeActions.getEmployeesRequest(query)),
});

export default connect(mapStateToProps, mapDispatchToProps)(DashboardPage);
