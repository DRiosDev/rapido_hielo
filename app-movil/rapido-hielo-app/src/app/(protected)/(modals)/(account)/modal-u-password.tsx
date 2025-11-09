import { axiosInstance } from "@/axios/axiosInstance";
import { BackButtonNavegation } from "@/components/navegation/BackButtonNavegation";
import ButtonBottom from "@/components/ui/ButtonBottom";
import CustomTextInput from "@/components/ui/design/CustomTextInput";
import { Stack } from "expo-router";
import { Formik } from "formik";
import React, { useRef, useState } from "react";
import { Keyboard, View } from "react-native";
import { showMessage } from "react-native-flash-message";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import * as Yup from "yup";

const ModalUPasswordSchema = Yup.object().shape({
  current_password: Yup.string()
    .max(20, "Máximo 20 caracteres")
    .min(8, "Mínimo 8 caracteres")
    .required("Campo obligatorio"),
  new_password: Yup.string()
    .max(20, "Máximo 20 caracteres")
    .min(8, "Mínimo 8 caracteres")
    .required("Campo obligatorio"),
  new_password_confirmation: Yup.string()
    .oneOf([Yup.ref("new_password"), null], "Las contraseñas no coinciden")
    .max(20, "Máximo 20 caracteres")
    .min(8, "Mínimo 8 caracteres")
    .required("Campo obligatorio"),
});

export default function ModalUPassword() {
  // Refs para inputs
  const currentPasswordRef = useRef<any>(null);
  const newPasswordRef = useRef<any>(null);
  const newPasswordConfirmationRef = useRef<any>(null);

  const formikRef = useRef<any>(null);

  const [isLoadingButton, setIsLoadingButton] = useState<boolean>(false);

  const changePassword = async (values) => {
    setIsLoadingButton(true);

    try {
      const formData = new FormData();
      formData.append("current_password", values.current_password);
      formData.append("new_password", values.new_password);
      formData.append(
        "new_password_confirmation",
        values.new_password_confirmation
      );

      await axiosInstance.patch("/api/account/password", formData);
      showMessage({
        message: "Contraseña cambiada con éxito",
        icon: "success",
        type: "success",
      });
    } catch (error: any) {
      showMessage({
        message: "No se ha podido cambiar la contraseña",
        description:
          typeof error?.response?.data?.message === "string" &&
          error.response.data.message,
        icon: "danger",
        type: "danger",
      });
    } finally {
      setIsLoadingButton(false);
    }
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: "Cambiar contraseña",
          headerShadowVisible: false,
          headerLeft: () => <BackButtonNavegation />,
        }}
      />

      <View className="flex-1 p-5 bg-white">
        <KeyboardAwareScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ flexGrow: 1 }}
        >
          <Formik
            innerRef={formikRef}
            initialValues={{
              current_password: "",
              new_password: "",
              new_password_confirmation: "",
            }}
            validationSchema={ModalUPasswordSchema}
            onSubmit={changePassword}
          >
            {({
              handleChange,
              handleBlur,
              handleSubmit,
              values,
              errors,
              touched,
            }) => (
              <View>
                <CustomTextInput
                  label="Contraseña actual"
                  ref={currentPasswordRef}
                  value={values.current_password}
                  onChangeText={handleChange("current_password")}
                  onBlur={handleBlur("current_password")}
                  isPassword
                  returnKeyType="next"
                  onSubmitEditing={() => newPasswordRef.current?.focus()}
                  error={touched.current_password && !!errors.current_password}
                  errorMessage={errors.current_password}
                />

                <CustomTextInput
                  label="Nueva contraseña"
                  ref={newPasswordRef}
                  value={values.new_password}
                  onChangeText={handleChange("new_password")}
                  onBlur={handleBlur("new_password")}
                  isPassword
                  returnKeyType="next"
                  onSubmitEditing={() =>
                    newPasswordConfirmationRef.current?.focus()
                  }
                  error={touched.new_password && !!errors.new_password}
                  errorMessage={errors.new_password}
                />

                <CustomTextInput
                  label="Confirmar nueva contraseña"
                  ref={newPasswordConfirmationRef}
                  value={values.new_password_confirmation}
                  onChangeText={handleChange("new_password_confirmation")}
                  onBlur={handleBlur("new_password_confirmation")}
                  isPassword
                  returnKeyType="done"
                  onSubmitEditing={() => Keyboard.dismiss}
                  error={
                    touched.new_password_confirmation &&
                    !!errors.new_password_confirmation
                  }
                  errorMessage={errors.new_password_confirmation}
                />
              </View>
            )}
          </Formik>
        </KeyboardAwareScrollView>

        <ButtonBottom
          loading={isLoadingButton}
          disabled={isLoadingButton}
          onPress={() => formikRef.current?.handleSubmit()}
        >
          Guardar
        </ButtonBottom>
      </View>
    </>
  );
}
