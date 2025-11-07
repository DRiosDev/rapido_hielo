import CustomButton from "@/components/ui/design/CustomButton";
import CustomTextInput from "@/components/ui/design/CustomTextInput";
import { useAuthUser } from "@/store/useAuthUser";
import { router } from "expo-router";
import { Formik } from "formik";
import React, { useRef, useState } from "react";
import {
  Keyboard,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { showMessage } from "react-native-flash-message";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import * as Yup from "yup";

const LoginSchema = Yup.object().shape({
  email: Yup.string()
    .max(90, "Máximo de caracteres 90")
    .email("Correo inválido")
    .required("Campo obligatorio"),
  password: Yup.string()
    .max(20, "Máximo 20 caracteres")
    .min(8, "Mínimo 8 caracteres")
    .required("Campo obligatorio"),
});

export default function SingIn() {
  const { login } = useAuthUser();

  const insets = useSafeAreaInsets();

  // Refs para inputs
  const emailRef = useRef<any>(null);
  const passwordRef = useRef<any>(null);

  const [loadingButton, setIsLoandingButton] = useState<boolean>(false);

  const onSubmit = async (values: { email: string; password: string }) => {
    try {
      setIsLoandingButton(true);
      await login(values.email, values.password);
    } catch (error: any) {
      setIsLoandingButton(false);
      Keyboard.dismiss();
      showMessage({
        message: "No se pudo iniciar sesión",
        description: error.message,
        icon: "danger",
        type: "danger",
      });
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <SafeAreaView
        className="justify-between flex-1 px-6 bg-white"
        style={{ paddingBottom: insets.bottom + 10 }}
      >
        <View>
          <Text className="w-full mb-10 text-3xl font-bold text-center">
            Inicio de sesión
          </Text>

          <Formik
            initialValues={{
              email: "dr@yopmail.com",
              password: "12345678",
            }}
            validationSchema={LoginSchema}
            onSubmit={onSubmit}
          >
            {({
              handleChange,
              handleBlur,
              handleSubmit,
              values,
              errors,
              touched,
            }) => (
              <View className="flex justify-center w-full">
                <CustomTextInput
                  label="Correo electrónico"
                  value={values.email}
                  ref={emailRef}
                  onChangeText={handleChange("email")}
                  onBlur={handleBlur("email")}
                  keyboardType="email-address"
                  returnKeyType="next"
                  onSubmitEditing={() => passwordRef.current?.focus()}
                  error={touched.email && !!errors.email}
                  errorMessage={errors.email}
                />

                <CustomTextInput
                  ref={passwordRef}
                  label="Contraseña"
                  value={values.password}
                  onChangeText={handleChange("password")}
                  onBlur={handleBlur("password")}
                  isPassword
                  returnKeyType="done"
                  onSubmitEditing={() => Keyboard.dismiss} // envía formulario
                  errorMessage={errors.password}
                />

                <TouchableOpacity
                  onPress={() => router.navigate("/recovery-password")}
                >
                  <Text className="w-full text-lg text-right text-primary">
                    ¿Olvidaste la contraseña?
                  </Text>
                </TouchableOpacity>

                <View className="mt-10">
                  <CustomButton
                    loading={loadingButton}
                    disabled={loadingButton}
                    onPress={() => handleSubmit()}
                  >
                    Iniciar sesión
                  </CustomButton>
                </View>
              </View>
            )}
          </Formik>
        </View>

        <View>
          <Text className="w-full pt-6 pb-4 text-lg text-center text-text-secondary">
            ¿No tienes cuenta?
          </Text>

          <CustomButton
            mode="outlined"
            onPress={() => router.navigate("/sing-up")}
          >
            Registrate
          </CustomButton>
        </View>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}
