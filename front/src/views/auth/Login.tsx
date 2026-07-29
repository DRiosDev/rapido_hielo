import { Alert, Button, Form, Input } from "antd";
import "aos/dist/aos.css";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CardBackgrounSection } from "../../components/ui/CardBackgrounSection";
import Meta from "../../components/ui/Meta";
import { clearUrl } from "../../helpers/clearUrl";
import {
  HOME,
  PRIVATEUSERS,
  REGISTER,
  REQUESTRESETPASSWORD,
} from "../../routes/Paths";
import { useAuthUser } from "../../store/useAuthUser";
import { LOGO } from "../../constants/LOGO";
import EmailFormItem from "../../components/ui/form/items/EmailFormItem";
import PasswordFormItem from "../../components/ui/form/items/PasswordFormItem";

export default function Login() {
  const { login, isAuthenticated, userLogged } = useAuthUser();

  const [isLoadingButton, setIsLoadingButton] = useState(false);

  const [alert, setAlert] = useState({
    isVisible: false,
    message: "",
    type: "",
  });

  const navigate = useNavigate();

  const [form] = Form.useForm();

  //Si ingresa al login desde la url pero esta autenticado que lo redirija al private
  useEffect(() => {
    if (isAuthenticated) {
      if (userLogged != null) {
        navigate(PRIVATEUSERS);
        return;
      }
    }
  }, [isAuthenticated, userLogged]);

  useEffect(() => {
    // Función para obtener el valor del parámetro 'i' de la URL para decirle que se registro correctamente
    const getParamI = () => {
      const searchParams = new URLSearchParams(window.location.search);
      const paramIValue = searchParams.get("i");

      if (paramIValue === "1") {
        clearUrl("i");
        setAlert({
          type: "success",
          isVisible: true,
          message: "Has sido agregado correctamente.",
        });
      } else if (paramIValue === "2") {
        clearUrl("i");
        setAlert({
          type: "success",
          isVisible: true,
          message: "Has cambiado tu contraseña correctamente.",
        });
      }
    };

    window.scrollTo(0, 0);
    // Llama a la función para obtener el valor del parámetro 'i' al cargar la página
    getParamI();
  }, []);

  //Login
  const handleButtonLogin = async () => {
    setAlert((prevState) => ({
      ...prevState,
      isVisible: false,
    }));

    const formValues = form.getFieldsValue();

    try {
      setIsLoadingButton(true);

      await login(formValues.email, formValues.password);
    } catch (error: any) {
      setIsLoadingButton(false);
      setAlert({
        type: "error",
        isVisible: true,
        message: error.message,
      });
    }
  };

  return (
    <>
      <Meta title="Inicia sesión" description="Accede a tu cuenta." />

      <CardBackgrounSection>
        {/* Logo vortex */}
        <Link to={HOME} className="mx-auto w-full block max-w-[128px]">
          <img src={LOGO} alt="logo" />
        </Link>

        {/*Text */}
        <div className="mt-4 mb-8 text-center">
          <h2 className="text-2xl font-bold text-center sora-font md:text-3xl">
            Iniciar sesión
          </h2>
        </div>

        {/* Form */}
        <Form
          className="w-full "
          form={form}
          layout="vertical"
          onFinish={handleButtonLogin}
        >
          {/* Alert Success */}
          {alert.type === "success" && alert.isVisible && (
            <div className="mb-4">
              <Alert description={alert.message} type={alert.type} showIcon />
            </div>
          )}

          {/* email */}
          <EmailFormItem required={true} />

          {/* Password */}
          <PasswordFormItem />

          {/* Alert error */}
          {alert.isVisible && alert.type === "error" && (
            <div className="mb-4">
              <Alert
                message="Error"
                description={alert.message}
                type={alert.type}
                showIcon
              />
            </div>
          )}

          {/* Button */}
          <Form.Item className="mt-6">
            <Button
              type="primary"
              className="w-full"
              loading={isLoadingButton}
              htmlType="submit"
            >
              Iniciar sesión
            </Button>
          </Form.Item>

          {/* Links */}
          <div className="mt-6 text-center">
            <Link
              to={REGISTER}
              className="inline-block text-sm text-text-primary hover:text-text-primary"
            >
              ¿No tienes cuenta?{" "}
              <span className="text-primary">Registrate aquí</span>
            </Link>
            <Link
              to={REQUESTRESETPASSWORD}
              className="inline-block text-sm text-text-primary hover:text-text-primary"
            >
              ¿Olvidaste tu contraseña?{" "}
              <span className="text-primary">Recupérala aquí</span>
            </Link>
          </div>
        </Form>
      </CardBackgrounSection>
    </>
  );
}
