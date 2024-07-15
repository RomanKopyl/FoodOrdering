import { useOrderDetails } from '@/src/api/orders';
import { useUpdateOrderSubscriptions } from '@/src/api/orders/subscritptions';
import OrderItemListItem from '@/src/components/OrderItemListItem';
import OrderListItem from '@/src/components/OrderListItem';
import { Stack, useLocalSearchParams } from 'expo-router';
import { ActivityIndicator, Alert, FlatList, StyleSheet, Text, View } from 'react-native';

const OrderDetailScreen = () => {
  const { id: idString } = useLocalSearchParams();
  let id;
  if (!idString) {
    Alert.alert('Id is undefined');
    return;
  }
  id = parseFloat(typeof idString == 'string' ? idString : idString[0]);
  const { data: order, isLoading, error } = useOrderDetails(id);

  useUpdateOrderSubscriptions(id);

  if (isLoading) {
    return <ActivityIndicator />;
  }

  if (error) {
    return <Text>Failed to fetch product</Text>
  }

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: `Order #${order?.id}` }} />

      <OrderListItem order={order} />

      <FlatList
        data={order?.order_items}
        renderItem={({ item }) => <OrderItemListItem item={item} />}
        contentContainerStyle={{ gap: 10 }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    flex: 1,
    gap: 10,
  },
});

export default OrderDetailScreen;