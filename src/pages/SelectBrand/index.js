import { LoadingOutlined } from '@ant-design/icons';
import { Spin } from 'antd';
import React from 'react';
import { connect } from 'react-redux';
import { BRAND_ID_LOCALSTORAGE } from '../../constants/service';

import { BrandActions } from '../../redux/actions/brand.actions';
import { EmployeeActions } from '../../redux/actions/employee.actions';
import { store } from '../../redux/store';
import {
  BrandContainer,
  BrandImg,
  BrandImgContainer,
  BrandName,
  BrandProfile,
  Wrapper,
} from './styles';

const SelectBrandPage = ({
  brandList = [],
  onSelectBrand,
  onGetEmployeeInfo,
  history,
  loading,
}) => {
  const clickedHandler = (id) => {
    onSelectBrand(id);
    window.localStorage.setItem(BRAND_ID_LOCALSTORAGE, id);

    const { claims } = store.getState().auth;

    const userId = claims['beanswap-id'];

    window.localStorage.setItem('currentUserId', userId);
    onGetEmployeeInfo(userId);
    history.push('/');
  };
  return (
    <div
      style={{
        background: 'white',
        fontWeight: '300',
        color: '#6d6d6d',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100vw',
        height: '100vh',
      }}
    >
      <Wrapper>
        <h1
          style={{
            color: '#3f51b5',
            fontSize: '50px',
            marginBottom: '6.25rem',
          }}
        >
          Choose A Brand
        </h1>
        <BrandContainer>
          {loading && (
            <Spin
              indicator={
                <LoadingOutlined style={{ fontSize: 100 }} spin={loading} />
              }
            />
          )}
          {brandList &&
            !loading &&
            brandList.map((brand) => (
              <BrandProfile
                key={brand.id}
                onClick={() => clickedHandler(brand.id)}
              >
                <BrandImgContainer>
                  <BrandImg src={brand.logoUrl} />
                </BrandImgContainer>
                <BrandName>{brand.name}</BrandName>
              </BrandProfile>
            ))}
        </BrandContainer>
      </Wrapper>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    ...state,
    brandList: state.brand.brandList,
    loading: state.brand.loading,
  };
};

const mapDispatchToProps = (dispatch) => ({
  onSelectBrand: (id, query) =>
    dispatch(BrandActions.getBrandByIdRequest(id, query)),
  onGetEmployeeInfo: (id) =>
    dispatch(EmployeeActions.getEmployeeByIdRequest(id)),
});

export default connect(mapStateToProps, mapDispatchToProps)(SelectBrandPage);
