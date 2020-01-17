/**
 * 360loan-india
 * @author luxun
*/

import { post } from 'src/utils/fetch';
import { API_AGREEMENT_INFO_QUERY } from 'src/constants/apis';
import { IS_LOCAL } from '../../constants/envs';
import { getProtocol } from '../../utils/common';

export const getProtocolParam = async (agreementNo = '') => {
  let rst = {};
  if (agreementNo) {
    rst = await post(API_AGREEMENT_INFO_QUERY, {
      agreementNo,
    }); 
  }
  const { paramJson = '', templateNo } = rst;
  let paramData = {};
  if (paramJson) {
    paramData = JSON.parse(paramJson || '');
  }
  const agreementParam = {
    agreementNo: agreementNo || '',
    address: paramData.address || '',
    platformName: paramData.platformName || '',
    birthday: paramData.birthday || '',
    repaymentAmount: paramData.repaymentAmount || '',
    cardNo: paramData.cardNo || '',
    contactTel: paramData.contactTel || '',
    overdueCharges: paramData.overdueCharges || '',
    dayRate: paramData.dayRate || '',
    loanEffectiveDate: paramData.loanEffectiveDate || '',
    sex: paramData.sex || '',
    processingFees: paramData.processingFees || '',
    mobileNo: paramData.mobileNo || '',
    ifscCode: paramData.ifscCode || '',
    panNo: paramData.panNo || '',
    lender: paramData.lender || '',
    convenienceFee: paramData.convenienceFee || '',
    riskCategory: paramData.riskCategory || '',
    name: paramData.name || '',
    yearRate: paramData.yearRate || '',
    loanAmount: paramData.loanAmount || '',
    tenure: paramData.tenure || '',
    contactNameAndRelationship: paramData.contactNameAndRelationship || '',
  };
  return {
    agreementParam,
    templateNo,
  };
};

export const getProtocolContent = async (templateNo = 'AT5880466922788626001') => {
  const prefix = 'http';
  let cdnUrl = '';
  switch (__ENV__) {
    case 'development':
      cdnUrl = 'http://36.110.234.225/static/testpackage/html/india-loan/';
      break;
    case 'DEV':
      cdnUrl = `${prefix}://jira.360haojie.loan:8080/static/testpackage/html/india-loan/`;
      break;
    case 'STG':
      cdnUrl = `${prefix}://36.110.234.225/static/testpackage/html/india-loan/`;
      break;
    case 'STG2':
      cdnUrl = `${prefix}://36.110.234.225/static/testpackage/html/india-loan/`;
      break;
    case 'production':
      cdnUrl = `${prefix}://cdn-daikuan.360jie.com.cn/html/india-loan/`;
      break;
    default:
      cdnUrl = `${prefix}://36.110.234.225/static/testpackage/html/india-loan/`;
      break;
  }
  if (IS_LOCAL) cdnUrl = 'http://localhost/contract/india-loan/';
  const url = `${cdnUrl}${templateNo}.html`;
  const content = await getProtocol(url);
  return content;
};
