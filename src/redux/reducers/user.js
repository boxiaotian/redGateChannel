import { setCahce, getCahce } from '@/utils/cache'

const member_info = getCahce('member_info') ? getCahce('member_info') : {}
const USER_STATE = {
  memberInfo: { ...member_info },
  a: { a: 1 }
}

export default function login(prestate = USER_STATE, action) {
  switch (action.type) {
    case 'getMemberInfo':
      console.log(action);

      setCahce('member_info', action.memberInfo) //设置缓存
      return { ...prestate, ...action }
    default:
      return { ...prestate }
  }
} 