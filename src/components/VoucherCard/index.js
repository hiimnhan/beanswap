import { Card } from 'antd';
import React from 'react';
import moment from 'moment';
const VoucherCard = ({ item, loading }) => {
  const { Meta } = Card;
  return (
    <Card
      style={{ width: 400, margin: 20 }}
      hoverable
      cover={<img alt="banner" src={item.photoUrl} loading={loading} />}
    >
      <Meta title={item.name} description={item.description} />
      <span
        style={{ marginTop: 20, display: 'inline-block' }}
      >{`Purchase Date: ${moment(item.startPurchaseDate).format(
        'MMM Do YYYY'
      )} - ${moment(item.endPurchaseDate).format('MMM Do YYYY')} `}</span>
      <span
        style={{ marginTop: 20, display: 'inline-block' }}
      >{`Redeem Date: ${moment(item.startRedeemDate).format(
        'MMM Do YYYY'
      )} - ${moment(item.endRedeemDate).format('MMM Do YYYY')} `}</span>
    </Card>
  );
};

export default VoucherCard;
