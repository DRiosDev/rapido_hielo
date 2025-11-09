import CustomTextInput from "@/components/ui/design/CustomTextInput";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { Keyboard } from "react-native";
import { TextInput } from "react-native-paper";

interface SearchInputProps {
  onSearch: (value: string) => void;
  placeholder?: string;
}

export default function SearchInput({
  onSearch,
  placeholder = "Buscar",
}: SearchInputProps) {
  const [search, setSearch] = useState("");

  return (
    <CustomTextInput
      label={placeholder}
      backgroundColor="#E8E9F1"
      value={search}
      onChangeText={setSearch}
      returnKeyType="search"
      onSubmitEditing={() => onSearch(search)}
      left={
        <TextInput.Icon icon={() => <Ionicons name="search" size={20} />} />
      }
      rightIcon={
        search.trim().length > 0 && (
          <TextInput.Icon
            onPress={() => {
              onSearch("");
              setSearch("");
            }}
            icon={() => <Ionicons name="close-outline" size={20} />}
            forceTextInputFocus={false}
          />
        )
      }
    />
  );
}
