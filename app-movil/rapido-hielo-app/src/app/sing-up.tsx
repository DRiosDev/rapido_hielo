import { axiosInstance } from "@/axios/axiosInstance";
import CustomButton from "@/components/ui/design/CustomButton";
import CustomTextInput from "@/components/ui/design/CustomTextInput";
import { formatRut, validateRut } from "@/utils/rut";
import { router } from "expo-router";
import { Formik } from "formik";
import React, { useRef, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { showMessage } from "react-native-flash-message";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import * as Yup from "yup";

const LoginSchema = Yup.object().shape({
  rut: Yup.string()
    .required("Campo obligatorio")
    .test("rut-valido", "RUN inválido", (value) => {
      if (!value) return false;
      return validateRut(value);
    }),
  name: Yup.string().required("Campo obligatorio"),
  lastname: Yup.string().required("Campo obligatorio"),
  address: Yup.string().required("Campo obligatorio"),
  phone: Yup.string()
    .matches(/^[0-9]+$/, "Solo números")
    .min(9, "Mínimo 9 dígitos")
    .max(9, "Máximo 9 dígitos")
    .required("Campo obligatorio"),
  email: Yup.string()
    .email("Correo inválido")
    .max(90, "Máximo de caracteres 90")
    .required("Campo obligatorio"),
  password: Yup.string()
    .min(8, "Mínimo 8 caracteres")
    .max(20, "Máximo 20 caracteres")
    .required("Campo obligatorio"),
  password_confirmation: Yup.string()
    .oneOf([Yup.ref("password")], "Las contraseñas no coinciden")
    .required("Campo obligatorio"),
});

export default function SignUp() {
  const insets = useSafeAreaInsets();

  const emailRef = useRef<any>(null);
  const passwordRef = useRef<any>(null);
  const confirmPasswordRef = useRef<any>(null);

  const [loading, setLoading] = useState(false);

  const onSubmit = async (values: any) => {
    try {
      setLoading(true);

      const { data } = await axiosInstance.post("/api/auth/register", values);

      showMessage({
        message: "Usuario creado correctamente",
        type: "success",
      });

      router.replace("/sing-in");
    } catch (error: any) {
      let description = "Ha ocurrido un error inesperado";
      if (error?.response?.data?.errors) {
        // Formatear los errores de validación del backend
        const errors = error.response.data.errors;
        description = Object.values(errors).flat().join("\n");
      } else if (error?.response?.data?.message) {
        description = error.response.data.message;
      }

      showMessage({
        message: "Error al registrar",
        description: description,
        type: "danger",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView
      className="flex-1 px-6 bg-white"
      style={{ paddingBottom: insets.bottom }}
    >
      <KeyboardAwareScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}
        showsVerticalScrollIndicator={false}
      >
        <Text className="mb-6 text-3xl font-bold text-center">Crear cuenta</Text>

        <Formik
          initialValues={{
            rut: "",
            name: "",
            lastname: "",
            address: "",
            phone: "",
            email: "",
            password: "",
            password_confirmation: "",
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
            setFieldValue,
          }) => (
            <View>
              {/* RUT */}
              <CustomTextInput
                label="Run"
                value={values.rut}
                onChangeText={(text) => setFieldValue("rut", formatRut(text))}
                onBlur={handleBlur("rut")}
                error={touched.rut && !!errors.rut}
                errorMessage={errors.rut}
              />

              {/* NAME */}
              <CustomTextInput
                label="Nombre"
                value={values.name}
                onChangeText={handleChange("name")}
                onBlur={handleBlur("name")}
                error={touched.name && !!errors.name}
                errorMessage={errors.name}
              />

              {/* LASTNAME */}
              <CustomTextInput
                label="Apellido"
                value={values.lastname}
                onChangeText={handleChange("lastname")}
                onBlur={handleBlur("lastname")}
                error={touched.lastname && !!errors.lastname}
                errorMessage={errors.lastname}
              />

              {/* ADDRESS */}
              <CustomTextInput
                label="Dirección"
                value={values.address}
                onChangeText={handleChange("address")}
                onBlur={handleBlur("address")}
                error={touched.address && !!errors.address}
                errorMessage={errors.address}
              />

              {/* PHONE */}
              <CustomTextInput
                label="Teléfono"
                value={values.phone}
                onChangeText={handleChange("phone")}
                onBlur={handleBlur("phone")}
                keyboardType="numeric"
                error={touched.phone && !!errors.phone}
                errorMessage={errors.phone}
              />

              {/* EMAIL */}
              <CustomTextInput
                label="Correo"
                value={values.email}
                ref={emailRef}
                onChangeText={handleChange("email")}
                onBlur={handleBlur("email")}
                keyboardType="email-address"
                error={touched.email && !!errors.email}
                errorMessage={errors.email}
              />

              {/* PASSWORD */}
              <CustomTextInput
                label="Contraseña"
                value={values.password}
                ref={passwordRef}
                onChangeText={handleChange("password")}
                onBlur={handleBlur("password")}
                isPassword
                error={touched.password && !!errors.password}
                errorMessage={errors.password}
              />

              {/* CONFIRM PASSWORD */}
              <CustomTextInput
                label="Confirmar contraseña"
                value={values.password_confirmation}
                ref={confirmPasswordRef}
                onChangeText={handleChange("password_confirmation")}
                onBlur={handleBlur("password_confirmation")}
                isPassword
                error={
                  touched.password_confirmation && !!errors.password_confirmation
                }
                errorMessage={errors.password_confirmation}
              />

              <View className="mt-6">
                <CustomButton
                  loading={loading}
                  disabled={loading}
                  onPress={() => handleSubmit()}
                >
                  Crear cuenta
                </CustomButton>
              </View>
            </View>
          )}
        </Formik>

        <TouchableOpacity onPress={() => router.replace("/sing-in")}>
          <Text className="mt-6 text-center text-primary pb-4">
            ¿Ya tienes cuenta? Inicia sesión
          </Text>
        </TouchableOpacity>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
}
