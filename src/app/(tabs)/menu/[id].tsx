import { View, Text, Image, StyleSheet, Pressable } from 'react-native'
import React, { useState } from 'react'
import { Stack, useLocalSearchParams } from 'expo-router'
import products from '@/assets/data/products';
import Button from '@/src/components/Button';

const sizes = ['S', 'M', 'L', 'XL'];

const ProdductDetailsScreen = () => {
  const { id } = useLocalSearchParams();
  const [selectedSize, setSelectedSize] = useState('M');

  const product = products.find((p) => p.id.toString() === id);

  const addToCard = () => {
    console.warn('Adding to card, size:', selectedSize);    
  };

  if (!product) {
    return <Text>Product not found</Text>;
  }

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: product?.name }} />
      {
        product.image &&
        <Image
          source={{ uri: product.image }}
          style={styles.image} />
      }

      <Text>Select size</Text>
      <View style={styles.sizes}>
        {sizes.map((size) => (
          <Pressable
            style={[
              styles.size,
              {
                backgroundColor: size === selectedSize ? 'gainsboro' : 'white'
              },
            ]}
            onPress={() => setSelectedSize(size)}
          >
            <Text
              key={size}
              style={[
                styles.sizeText,
                {
                  color: size === selectedSize ? 'black' : 'gray'
                },
              ]}>{size}</Text>
          </Pressable>
        ))}
      </View>

      <Text style={styles.price}>Price: ${product.price}</Text>

      <Button onPress={addToCard} text={'Add to card'} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  image: {
    width: '100%',
    aspectRatio: 1,
  },

  sizes: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 10,
  },
  size: {
    backgroundColor: 'gainsboro',
    width: 50,
    aspectRatio: 1,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sizeText: {
    fontSize: 20,
    fontWeight: '500',
  },

  price: {
    fontSize: 18,
    fontWeight: 'bold',
  },
})

export default ProdductDetailsScreen;