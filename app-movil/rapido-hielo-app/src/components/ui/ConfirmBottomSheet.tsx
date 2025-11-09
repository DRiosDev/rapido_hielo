import { Colors } from "@/constants/Colors";
import BottomSheet, { BottomSheetBackdrop } from "@gorhom/bottom-sheet";
import React, {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import { StyleSheet, Text, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Portal } from "react-native-paper";
import CustomButton from "./design/CustomButton";

export interface ConfirmBottomSheetRef {
  childFunction: (index: number) => void; // Definimos el tipo con parámetros
}

interface ConfirmSheetProps {
  title?: string;
  message?: string;
  onConfirm: () => void;
}

export const ConfirmBottomSheet = forwardRef<
  ConfirmBottomSheetRef,
  ConfirmSheetProps
>((props, ref) => {
  const sheetRef = useRef<BottomSheet>(null);

  const { title, message, onConfirm } = props;

  const [isOpen, setIsOpen] = useState<boolean>(false);

  const childFunction = () => {
    setIsOpen(true);
    sheetRef.current?.snapToIndex(0);
  };

  const close = () => {
    sheetRef.current?.close();
  };

  // expone funciones al padre
  useImperativeHandle(ref, () => ({
    childFunction,
    close,
  }));

  const snapPoints = useMemo(() => ["40%"], []);

  const handleSheetChange = useCallback((index) => {
    console.log("handleSheetChange", index);
  }, []);

  const handleConfirm = useCallback(() => {
    onConfirm();
  }, [onConfirm]);

  const handleSheetClose = useCallback(() => {
    setIsOpen(false); // también al cerrar por swipe
  }, []);

  // 👇 Backdrop que solo aparece en el índice 0 (25%)
  const renderBackdrop = useCallback(
    (props) => (
      <BottomSheetBackdrop
        {...props}
        appearsOnIndex={0} // aparece cuando el sheet está en snapPoint 0 (25%)
        disappearsOnIndex={-1} // desaparece cuando se cierra
        opacity={0.5} // opacidad del fondo
      />
    ),
    []
  );

  return (
    <Portal>
      {isOpen && (
        <GestureHandlerRootView
          style={[styles.container, !isOpen && { pointerEvents: "none" }]}
        >
          <BottomSheet
            ref={sheetRef}
            snapPoints={snapPoints}
            enableDynamicSizing={false}
            onChange={handleSheetChange}
            onClose={handleSheetClose}
            enablePanDownToClose={true}
            backdropComponent={renderBackdrop} // 👈 usa la función personalizada
          >
            <View className="flex-1 justify-between p-6">
              <View>
                <Text className="text-xl font-bold mb-2">{title}</Text>
                <Text className="text-base text-text-secondary">{message}</Text>
              </View>

              <View className="flex-col justify-end gap-4">
                <CustomButton
                  style={{ backgroundColor: Colors.redError }}
                  onPress={handleConfirm}
                >
                  Confirmar
                </CustomButton>

                <CustomButton
                  mode="outlined"
                  style={{
                    borderWidth: 2,
                    borderColor: Colors.textSecondary,
                  }}
                  labelStyle={{ color: Colors.textSecondary }}
                  onPress={close}
                >
                  Cancelar
                </CustomButton>
              </View>
            </View>
          </BottomSheet>
        </GestureHandlerRootView>
      )}
    </Portal>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    inset: 0,
    zIndex: 9999,
    position: "absolute",
    paddingTop: 200,
  },
  contentContainer: {
    backgroundColor: "white",
  },
  itemContainer: {
    padding: 6,
    margin: 6,
    backgroundColor: "#eee",
  },
});
