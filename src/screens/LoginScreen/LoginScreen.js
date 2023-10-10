import React, { useMemo, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useTheme } from '@react-navigation/native';
import { View, Image, TouchableOpacity, SafeAreaView } from 'react-native';
import PropTypes from 'prop-types';
import { useForm, Controller } from 'react-hook-form';
import { Text } from 'components';

import DeviceInfo from 'react-native-device-info';
import createStyles from './LoginScreen.style';
import TextInput from '../../components/TextInput';
import images from '../../constants/images';

import i18n from '../../i18n';
import LoaderButton from '../../components/LoaderButton';
import { ScrollView } from 'react-native-gesture-handler';

import { HELP_URL } from 'constants/url.js';
import { openURL } from '../../helpers/UrlHelper';
import { EMAIL_REGEX } from '../../helpers/formHelper';
import { actions as authActions, resetAuth } from 'reducer/authSlice';

import { selectInstallationUrl, selectBaseUrl } from 'reducer/settingsSlice';

const appName = DeviceInfo.getApplicationName();

const propTypes = {
  onLogin: PropTypes.func,
  isLoggingIn: PropTypes.bool,
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    dispatch: PropTypes.func.isRequired,
  }).isRequired,
  resetAuth: PropTypes.func,
  installationUrl: PropTypes.string,
};

const defaultProps = {
  onLogin: () => {},
  isLoggingIn: false,
};

const LoginScreenComponent = ({ navigation }) => {
  const theme = useTheme();
  const { colors } = theme;
  const styles = useMemo(() => createStyles(theme), [theme]);

  const dispatch = useDispatch();
  const { isLoggingIn } = useSelector(state => state.auth);

  const installationUrl = useSelector(selectInstallationUrl);
  const baseUrl = useSelector(selectBaseUrl);

  useEffect(() => {
    dispatch(resetAuth());
    if (!installationUrl) {
      navigation.navigate('ConfigureURL');
    }
  }, [installationUrl, navigation, dispatch]);

  const doSignup = () => {
    openURL({ URL: HELP_URL });
  };

  const { navigate } = navigation;

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
  });
  const onSubmit = data => {
    const { email, password } = data;
    dispatch(authActions.doLogin({ email, password }));
  };

  return (
    <SafeAreaView style={styles.keyboardView}>
      <ScrollView contentContainerStyle={styles.scrollView} keyboardShouldPersistTaps="handled">
        <View style={styles.logoView}>
          <Image style={styles.logo} source={images.login} />
        </View>
        <View style={styles.titleView}>
          <Text lg medium color={colors.textDark} style={styles.titleText}>
            {i18n.t('LOGIN.TITLE')}
          </Text>
          {baseUrl ? (
            <Text sm color={colors.textLight} style={styles.subTitleText}>
              {i18n.t('LOGIN.DESCRIPTION', { baseUrl })}
            </Text>
          ) : null}
        </View>

        <View style={styles.contentView}>
          <View style={styles.formView}>
            <View>
              <Controller
                control={control}
                rules={{
                  required: i18n.t('LOGIN.EMAIL_REQUIRED'),
                  pattern: {
                    value: EMAIL_REGEX,
                    message: i18n.t('LOGIN.EMAIL_ERROR'),
                  },
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    style={styles.input}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    errors={errors}
                    error={errors.email}
                    label={i18n.t('LOGIN.EMAIL')}
                    keyboardType="email-address"
                    errorMessage={i18n.t('LOGIN.EMAIL_ERROR')}
                    secureTextEntry={false}
                  />
                )}
                name="email"
              />
              <View style={styles.spacer} />
              <View />
              <Controller
                control={control}
                rules={{
                  required: i18n.t('LOGIN.PASSWORD_REQUIRED'),
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    style={styles.input}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    errors={errors}
                    error={errors.password}
                    label={i18n.t('LOGIN.PASSWORD')}
                    keyboardType="default"
                    errorMessage={i18n.t('LOGIN.PASSWORD_ERROR')}
                    secureTextEntry={true}
                  />
                )}
                name="password"
              />
            </View>
            <TouchableOpacity style={styles.forgotView} onPress={() => navigate('ResetPassword')}>
              <Text xs medium color={colors.textLight}>
                {i18n.t('LOGIN.FORGOT_PASSWORD')}
              </Text>
            </TouchableOpacity>
            <View style={styles.loginButtonView}>
              <LoaderButton
                titleStyle={styles.loginButton}
                loading={isLoggingIn}
                colorScheme="primary"
                onPress={handleSubmit(onSubmit)}
                size="expanded"
                text={i18n.t('LOGIN.LOGIN')}
              />
            </View>
          </View>

          <View style={styles.linksContainer}>
            <View style={styles.accountView}>
              {appName === 'WiseWoot' && (
                <>
                  <TouchableOpacity onPress={doSignup}>
                    <Text xs medium color={colors.textLight}>
                      {i18n.t('LOGIN.CREATE_ACCOUNT')}
                    </Text>
                  </TouchableOpacity>
                  <Text color={colors.textLight}>{'   |   '}</Text>
                </>
              )}

              <TouchableOpacity onPress={() => navigate('ConfigureURL')}>
                <Text xs medium color={colors.textLight}>
                  {i18n.t('LOGIN.CHANGE_URL')}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

LoginScreenComponent.defaultProps = defaultProps;
LoginScreenComponent.propTypes = propTypes;
export default LoginScreenComponent;
