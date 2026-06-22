import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Platform, Pressable, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { services } from '../../data/Services'; 
import { Star, Clock, User, CheckCircle, XCircle } from 'lucide-react-native';
import CustomScroll from '../../components/CustomScroll';

export default function ServiceDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [isLoadingScreen, setIsLoadingScreen] = useState(true);  
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Busca el servicio que coincida con el ID de la ruta
  const service = services.find((s) => s.id === id);

  // Efecto de carga inicial para suavizar la transición de la interfaz
  useEffect(() => {
    let unmounted = false;

    const timer = setTimeout(() => {
      if (!unmounted) {
        setIsLoadingScreen(false);
      }
    }, 350);

    return () => {
      unmounted = true;
      clearTimeout(timer);
    };
  }, []);

  const handleRefreshDetail = () => {
    return new Promise<void>((resolve) => {
      setIsRefreshing(true);
      setTimeout(() => {
        setIsRefreshing(false);
        resolve();
      }, 1000);
    });
  };

  // Estado de error: Servicio no encontrado
  if (!service) {
    return (
      <View style={styles.messageCenter}>
        <Text style={styles.errorText}>El servicio no existe o no fue encontrado.</Text>
      </View>
    );
  }

  // Estado de carga en pantalla
  if (isLoadingScreen || isRefreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#7fac75" />
        <Text style={styles.loadingText}>Preparando formulario...</Text>
      </View>
    );
  }

  return (
    <CustomScroll 
      style={[styles.scrollContent, styles.container]}
      onRefreshAction={handleRefreshDetail}
    >
      <View>
        {/* Encabezado de Etiquetas: Categoría y Disponibilidad */}
        <View style={styles.badgeRow}>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>{service.category.toUpperCase()}</Text>
          </View>
          <View style={[styles.statusBadge, service.available ? styles.bgAvailable : styles.bgUnavailable]}>
            {service.available ? (
              <>
                <CheckCircle size={14} color="#2F855A" />
                <Text style={[styles.statusText, { color: '#2F855A' }]}>Disponible</Text>
              </>
            ) : (
              <>
                <XCircle size={14} color="#C53030" />
                <Text style={[styles.statusText, { color: '#C53030' }]}>No Disponible</Text>
              </>
            )}
          </View>
        </View>

        {/* Título Principal */}
        <Text style={styles.title}>{service.name}</Text>

        {/* Sección de Calificación (Rating) */}
        <View style={styles.ratingRow}>
          <Star size={18} color="#f39c12" fill="#f39c12" />
          <Text style={styles.ratingValue}>{service.rating}</Text>
          <Text style={styles.reviewCount}>({service.reviewCount} opiniones)</Text>
        </View>

        {/* Información del Proveedor */}
        <View style={styles.infoItem}>
          <User size={18} color="#4A5568" />
          <View>
            <Text style={styles.infoLabel}>Proveedor</Text>
            <Text style={styles.infoValue}>{service.providerName}</Text>
          </View>
        </View>

        {/* Información de Duración */}
        <View style={styles.infoItem}>
          <Clock size={18} color="#4A5568" />
          <View>
            <Text style={styles.infoLabel}>Duración Promedio</Text>
            <Text style={styles.infoValue}>{service.durationMinutes} min</Text>
          </View>
        </View>

        {/* Descripción del Servicio */}
        <Text style={styles.sectionTitle}>Acerca del servicio</Text>
        <Text style={styles.description}>{service.description}</Text>

        {/* Listado de Etiquetas (Tags) */}
        {service.tags && service.tags.length > 0 && (
          <View style={styles.tagsContainer}>
            {service.tags.map(tag => (
              <View key={tag} style={styles.tagBadge}>
                <Text style={styles.tagText}>#{tag}</Text>
              </View>
            ))}
          </View>
        )}
      </View>

      {/* Footer de Acción y Precio */}
      <View style={styles.footer}>
        <View>
          <Text style={styles.footerLabel}>Precio Total</Text>
          <Text style={styles.footerPrice}>{`${service.price} ${service.currency}`}</Text>
        </View>

        <Pressable 
          disabled={!service.available}
          style={[styles.submitButton, !service.available && styles.disabledButton]}
          onPress={() => router.push({
            pathname: '/form/form',
            params: { serviceId: service.id, serviceName: service.name }
          })}
        >
          <Text style={styles.buttonText}>Solicitar Servicio</Text>
        </Pressable>
      </View>

    </CustomScroll>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    gap: 12,
  },
  loadingText: {
    fontSize: 15,
    color: '#718096',
    fontWeight: '500',
  },
  messageCenter: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#718096',
  },
  badgeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  categoryBadge: {
    backgroundColor: '#E2E8F0',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  categoryText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#4A5568',
    letterSpacing: 0.5,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  bgAvailable: {
    backgroundColor: '#C6F6D5',
  },
  bgUnavailable: {
    backgroundColor: '#FED7D7',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1A202C',
    marginBottom: 10,
    fontFamily: Platform.OS === 'android' ? 'sans-serif-condensed' : 'System',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 20,
  },
  ratingValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2D3748',
  },
  reviewCount: {
    fontSize: 14,
    color: '#718096',
  },
  // Nota: infoCard está declarado pero no se usa actualmente en la vista
  infoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  infoItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12,
  },
  infoLabel: {
    fontSize: 11,
    color: '#A0AEC0',
    textTransform: 'uppercase',
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2D3748',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2D3748',
    marginBottom: 8,
  },
  description: {
    fontSize: 15,
    color: '#4A5568',
    lineHeight: 22,
    marginBottom: 20,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 20,
  },
  tagBadge: {
    backgroundColor: '#EBF8FF',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  tagText: {
    fontSize: 12,
    color: '#2B6CB0',
    fontWeight: '600',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderColor: '#E2E8F0',
  },
  footerLabel: {
    fontSize: 12,
    color: '#718096',
  },
  footerPrice: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#7fac75',
  },
  submitButton: {
    backgroundColor: '#7fac75',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#CBD5E0',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});