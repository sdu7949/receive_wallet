import React from "react";
/* 아임포트 모듈을 불러옵니다. */
import IMP from "iamport-react-native";
/* 로딩 컴포넌트를 불러옵니다. */
import Loader from "../../components/Loader";

import { Alert } from "react-native";

import styled from "styled-components";
import { gql } from "apollo-boost";
import { useMutation } from "react-apollo-hooks";
import { NavigationActions, StackActions } from "react-navigation";
import constants from "../../constants";

const Container = styled.View`
  width: ${constants.width};
  height: 100%;
`;

const SEE_IMP_UID_CERT = gql`
  mutation seeImpUidCert($impUid: String!) {
    seeImpUidCert(impUid: $impUid)
  }
`;

const DUPLICATION_CHECK_PHONE = gql`
  mutation duplicationCheckPhone($phone: String!) {
    duplicationCheckPhone(phone: $phone)
  }
`;

const CREATE_USER = gql`
  mutation createUser(
    $email: String!
    $password: String!
    $name: String!
    $phone: String!
    $impUid: String!
  ) {
    createUser(
      email: $email
      password: $password
      name: $name
      phone: $phone
      impUid: $impUid
    ) {
      id
    }
  }
`;

const LOG_IN = gql`
  mutation createToken($email: String!, $password: String!) {
    createToken(email: $email, password: $password)
  }
`;

export function Certification({ navigation }) {
  /* [필수입력] 본인인증 종료 후, 라우터를 변경하고 결과를 전달합니다. */
  const email = navigation.getParam("email");
  const password = navigation.getParam("password");
  const name = navigation.getParam("name");

  const [seeImpUidCertMutation] = useMutation(SEE_IMP_UID_CERT);
  const [duplicationCheckPhoneMutation] = useMutation(DUPLICATION_CHECK_PHONE);
  const [createUserMutation] = useMutation(CREATE_USER);
  const [createTokenMutation] = useMutation(LOG_IN);

  const callback = async response => {
    console.log("response : ", response);

    //callback 결과값은 boolean reponse.success, imp_uid , merchant_uid
    //전화번호는 iamport input에 입력하기때문에 한번더 요청해서 데이터를 받아와야 한다

    if (response.success) {
      //response.success가 성공일 경우, response.imp_uid(본인인증에 성공한 uid)를 매개변수로 추가 본인정보를 더 불러오는 seeImpUidCert API를 호출한다
      const { data } = await seeImpUidCertMutation({
        variables: {
          impUid: response.imp_uid
        }
      });
      try {
        if (data && data.seeImpUidCert) {
          //iamport API로 호출한 데이터 결과로 true/false 구분
          const parsedInfo = JSON.parse(data.seeImpUidCert); //API server의 return값 == paymentData

          const {
            data: { duplicationCheckPhone }
          } = await duplicationCheckPhoneMutation({
            //있다면, 이제 DB 중복확인 절차
            variables: {
              phone: parsedInfo.phone
            }
          });

          if (duplicationCheckPhone) {
            return Alert.alert(
              "알림",
              "이미 존재하는 계정의 핸드폰 번호입니다",
              [
                {
                  text: "확인",
                  onPress: () => {
                    navigation.pop();
                  }
                }
              ],
              { cancelable: false }
            );
          } else {
            const user = await createUserMutation({
              //DB user row 생성 mutation
              variables: {
                email,
                password,
                name,
                phone: parsedInfo.phone,
                impUid: response.imp_uid
                // merchantUid: response.merchant_uid
              }
            });
            console.log("user.data.createUser : ", user.data.createUser);

            if (user && user.data && user.data.createUser) {
              //user가 정상적으로 생성 되었으면
              const {
                data: { createToken }
              } = await createTokenMutation({
                //토큰 생성(로그인) mutation
                variables: {
                  email,
                  password
                }
              });
              const resetAction = StackActions.reset({
                index: 0,
                key: null,
                actions: [
                  NavigationActions.navigate({
                    routeName: "SignUpComplete",
                    params: {
                      id: user.data.createUser.id, //생성된 id
                      name, //이름
                      token: createToken //생성한 토큰
                    }
                  })
                ]
              });
              navigation.dispatch(resetAction); //완료 후, SignUpComplete navigation으로 이동하면서 stack navigation을 다 날린다
            } else {
              throw new Error("Can't Create User");
            }
          }
        } else {
          throw new Error("Not Exists ImpUid");
        }
      } catch (e) {
        throw new Error(e);
      }
    } else {
      navigation.pop();
    }
  };

  /* [필수입력] 본인인증에 필요한 데이터를 입력합니다. */
  const data = {
    merchant_uid: `mid_${new Date().getTime()}`,
    company: "bboompet",
    // carrier: ["SKT", "KTF", "LGT", "MVNO"], // "SKT","KTF","LGT","MVNO"
    name,
    min_age: "1"
  };

  return (
    <Container>
      <IMP.Certification //형태가 특이하다 IMP(import name).Certification(component name)
        // userCode={"imp54142998"} // 가맹점 식별코드 / 뿜펫
        userCode={"imp73929832"} // 로디언즈
        loading={<Loader />} // 웹뷰 로딩 컴포넌트
        data={data} // 본인인증 데이터
        callback={callback} // 본인인증 종료 후 콜백
      />
    </Container>
  );
}

export default Certification;
