import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { FlatList, Platform, StyleSheet, Text, View } from 'react-native';
import Button from '../components/Button';
import CartListItem from '../components/CartListItem';
import { useCart } from '../providers/CartProvider';

const CartScreen = () => {
  const { items, total } = useCart();

  return (
    <View style={{ padding: 10 }}>
      <FlatList
        data={items}
        renderItem={({ item }) => <CartListItem cartItem={item} />}
        contentContainerStyle={styles.contentContainerStyle}
      />
      <Text style={{
        marginTop: 20,
        fontSize: 20,
      }}>Total: {total}</Text>
      <Button text="Chechout" />

      <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
    </View>
  )
}

export default CartScreen;

const styles = StyleSheet.create({
  contentContainerStyle: {
    padding: 10,
    gap: 10,
  },
})