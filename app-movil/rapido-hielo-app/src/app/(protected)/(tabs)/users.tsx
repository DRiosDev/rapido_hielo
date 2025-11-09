import LoadingOverlay from "@/components/ui/LoadingOverlay";
import LoadMoreButton from "@/components/ui/pagination/LoadMoreButton";
import SearchInput from "@/components/ui/SearchInput";
import { useUsersInfinite } from "@/services/user/queries";
import React, { useState } from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";

export default function Users() {
  const [searchQuery, setSearchQuery] = useState(""); // Enviar lo que escribe el usuario

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isRefetching,
    refetch,
  } = useUsersInfinite(searchQuery);

  const dataSource = data?.pages.flatMap((p) => p.items);

  return (
    <View className="flex-1 px-6 bg-white">
      <SearchInput onSearch={setSearchQuery} />

      {(isLoading || isRefetching) && <LoadingOverlay />}

      <FlatList
        data={dataSource}
        showsVerticalScrollIndicator={false}
        refreshing={isRefetching}
        onRefresh={refetch}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => console.log("Item:", item)}
            className="flex-row items-center gap-2 mb-6 rounded-lg"
          >
            <View className="w-14 h-14 items-center justify-center rounded-[15px] bg-[#E8E9F1]">
              <Text className="text-lg font-medium">
                {item.name[0] + item.lastname[0]}
              </Text>
            </View>

            <View className="">
              <Text className="text-lg font-medium">
                {item.name + " " + item.lastname}
              </Text>
              <Text className="text-xs font-medium text-green-500">
                {item.status === "active" ? "Activado" : "Desactivado"}
              </Text>
            </View>
          </TouchableOpacity>
        )}
        ListFooterComponent={
          <LoadMoreButton
            hasNextPage={hasNextPage}
            isLoading={isFetchingNextPage}
            onPress={() => fetchNextPage()}
          />
        }
      />
    </View>
  );
}
