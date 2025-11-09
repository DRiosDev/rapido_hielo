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

const ModalCUUserSchema = Yup.object().shape({
  name: Yup.string()
    .trim() //para caracteres en blanco
    .max(20, "Máximo de caracteres 20")
    .min(2, "Mínimo de caracteres 2")
    .required("Campo obligatorio"),
  lastname: Yup.string()
    .trim()
    .max(20, "Máximo de caracteres 20")
    .min(2, "Mínimo de caracteres 2")
    .required("Campo obligatorio"),
  email: Yup.string()
    .max(90, "Máximo de caracteres 90")
    .email("Correo inválido")
    .required("Campo obligatorio"),
});

export default function modalcuuser() {
  const formikRef = useRef<any>(null);

  const [loadingButton, setIsLoadingButton] = useState<boolean>(false);

  const nameRef = useRef<any>(null);
  const lastnameRef = useRef<any>(null);
  const emailRef = useRef<any>(null);

  const create = async (values) => {
    setIsLoadingButton(true);

    const formData = new FormData();
    formData.append("name", values.name);
    formData.append("lastname", values.lastname);
    formData.append("role", "normal");
    formData.append("email", values.email);

    await axiosInstance
      .post(`/api/users`, formData)
      .then(() => {
        showMessage({
          message: "Usuario creado con éxito",
          icon: "success",
          type: "success",
        });
      })
      .catch((error) => {
        console.log(error);
        showMessage({
          message: "No se ha podido crear el usuario",
          description:
            error.response?.data?.errors?.email &&
            "El correo electrónico ya existe, intenta con otro",
          icon: "danger",
          type: "danger",
        });
      })
      .finally(function () {
        setIsLoadingButton(false);
      });
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: "Crear Usuario",
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
              name: "",
              lastname: "",
              email: "",
            }}
            validationSchema={ModalCUUserSchema}
            onSubmit={create}
          >
            {({ handleChange, handleBlur, values, errors, touched }) => (
              <View>
                <CustomTextInput
                  label="Nombre"
                  ref={nameRef}
                  value={values.name}
                  onChangeText={handleChange("name")}
                  onBlur={handleBlur("name")}
                  autoCapitalize="words"
                  returnKeyType="next"
                  onSubmitEditing={() => lastnameRef.current?.focus()}
                  error={touched.name && !!errors.name}
                  errorMessage={errors.name}
                />

                <CustomTextInput
                  label="Apellido"
                  ref={lastnameRef}
                  value={values.lastname}
                  onChangeText={handleChange("lastname")}
                  onBlur={handleBlur("lastname")}
                  autoCapitalize="words"
                  returnKeyType="next"
                  onSubmitEditing={() => emailRef.current?.focus()}
                  error={touched.lastname && !!errors.lastname}
                  errorMessage={errors.lastname}
                />

                <CustomTextInput
                  label="Correo electrónico"
                  ref={emailRef}
                  value={values.email}
                  onChangeText={handleChange("email")}
                  onBlur={handleBlur("email")}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  returnKeyType="done"
                  onSubmitEditing={() => Keyboard.dismiss}
                  error={touched.email && !!errors.email}
                  errorMessage={errors.email}
                />
              </View>
            )}
          </Formik>
        </KeyboardAwareScrollView>
        <ButtonBottom
          loading={loadingButton}
          disabled={loadingButton}
          onPress={() => formikRef.current?.handleSubmit()}
        >
          Guardar
        </ButtonBottom>
      </View>
    </>
  );
}
