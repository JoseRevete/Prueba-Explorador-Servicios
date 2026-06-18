import React from 'react';
import { Service } from '../types/service';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Star } from 'lucide-react-native';
import { router } from 'expo-router';

function Card({ service, mode }: { service: Service; mode: 'default' | 'top' }) {

  // Redirecciona a la pantalla de detalle del servicio actual
  const navigateToDetail = () => {
    router.push({
      pathname: '/service/[id]',
      params: { id: service.id }
    });
  };

  // Renderizado optimizado para la lista horizontal de recomendados (Top Services)
  if (mode === 'top') {
    return (
      <Pressable onPress={navigateToDetail} style={[styles.card, { width: 200, height: 200, justifyContent: 'space-between' }]}>
        <Text style={[styles.cardTitle, { padding: 16, }]} numberOfLines={4}>
          {service.name}
        </Text>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', }}>
          <View style={styles.topPriceTag}>
            <Text style={styles.topPriceText}>
              {`${service.price} ${service.currency}`}
            </Text>
          </View>
          <View style={styles.ratingContainer}>
            <Star size={18} color="#f39c12" fill="#f39c12"/>
            <Text style={{ fontSize: 16, color: '#666666' }}>{service.rating}</Text>
          </View>
        </View>
      </Pressable>
    );
  }

  // Renderizado por defecto para el listado vertical principal
  return (
    <Pressable onPress={navigateToDetail} style={[styles.card, { padding: 16 }]}>
      <View style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <Text style={[styles.cardTitle, { width: '80%' }]} numberOfLines={2}>
          {service.name}
        </Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
          <Star size={16} color="#f39c12" />
          <Text style={{ fontSize: 14, color: '#666666' }}>{service.rating}</Text>
        </View>
      </View>
      <Text style={[styles.cardDescription, { maxWidth: '80%' }]} numberOfLines={3}>
        {service.description}
      </Text>
      <Text style={styles.cardPrice}>
        {`${service.price} ${service.currency}`}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 8,
  },
  cardDescription: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 8,
  },
  cardPrice: {
    fontWeight: 'bold',
    color: '#7fac75',
    fontSize: 16,
  },
  topPriceTag: {
    bottom: 0,
    left: 0,
    backgroundColor: '#77d0d8',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderTopRightRadius: 10,
  },
  topPriceText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginRight: 12,
  },
});

export default Card;