import { axiosInstance } from "@/axios/axiosInstance";
import CustomButton from "@/components/ui/design/CustomButton";
import CustomTextInput from "@/components/ui/design/CustomTextInput";
import { Formik } from "formik";
import React, { useState } from "react";
import { Text, View } from "react-native";
import { showMessage } from "react-native-flash-message";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Yup from "yup";

const RecoveryPasswordSchema = Yup.object().shape({
  email: Yup.string()
    .max(90, "Máximo de caracteres 90")
    .email("Correo inválido")
    .required("Campo obligatorio"),
});

export default function RecoveryPassword() {
  const [loadingButton, setIsLoadingButton] = useState<boolean>(false);

  const requestResetPassword = async (values) => {
    setIsLoadingButton(true);

    const formData = new FormData();
    formData.append("email", values.email);

    await axiosInstance
      .post("/api/password-reset", formData)
      .then(() => {
        showMessage({
          message: "Revisa tu bandeja de entrada",
          icon: "success",
          type: "success",
        });
      })
      .catch((error) => {
        console.log(error.response.data);

        if (typeof error?.response.data?.message === "string") {
          showMessage({
            message: "El correo no pudo ser enviado",
            description: error?.response.data?.message,
            icon: "danger",
            type: "danger",
          });
        }
      })
      .finally(function () {
        setIsLoadingButton(false);
      });
  };

  return (
    <SafeAreaView className="justify-between flex-1 px-6 bg-white">
      <View>
        <KeyboardAwareScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ flexGrow: 1 }}
        >
          <Text className="w-full text-3xl font-bold text-center mb-15">
            ¿Olvidate tu contraseña? Recuperala Aquí
          </Text>
          <Text className="w-full mt-4 mb-10 text-lg text-center">
            Ingresa tu correo electrónico, si es válido te llegara un enlace en
            la bandeja de entrada, tienes 1 hora para utilizarlo.
          </Text>

          <Formik
            initialValues={{
              email: "nicolasgarciajimenez12@gmail.com",
            }}
            validationSchema={RecoveryPasswordSchema}
            onSubmit={requestResetPassword}
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
                  onChangeText={handleChange("email")}
                  onBlur={handleBlur("email")}
                  keyboardType="email-address"
                  error={touched.email && !!errors.email}
                  errorMessage={errors.email}
                />

                <View className="mt-4">
                  <CustomButton
                    loading={loadingButton}
                    disabled={loadingButton}
                    onPress={() => handleSubmit()}
                  >
                    Solicitar enlace
                  </CustomButton>
                </View>
              </View>
            )}
          </Formik>
        </KeyboardAwareScrollView>
      </View>
    </SafeAreaView>
  );
}
