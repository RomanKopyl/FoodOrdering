import { useAdminOrderList } from '@/src/api/orders/index';
import OrderListItem from '@/src/components/OrderListItem';
import { ActivityIndicator, FlatList, Text } from 'react-native';

export default function OrdersScreen() {
  const { data: orders, isLoading, error } = useAdminOrderList({ archived: false });

  if (isLoading) {
    return <ActivityIndicator />;
  }

  if (error) {
    return <Text>Failed to fetch product</Text>
  }

  return (
    <FlatList
      data={orders}
      contentContainerStyle={{ gap: 10, padding: 10 }}
      renderItem={({ item }) => <OrderListItem order={item} />}
    />
  );
}