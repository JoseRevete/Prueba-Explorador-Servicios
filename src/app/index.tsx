import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, Platform, FlatList, ActivityIndicator, Pressable } from 'react-native';
import { services } from '../data/Services';
import { Service } from '../types/service';
import Card from '../components/Card';
import Filters from '../components/Filters';
import CustomScroll from '../components/CustomScroll';

function ServicesSearch() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>('Todos');
  const [status, setStatus] = useState<'loading' | 'error' | 'success'>('loading');
  const [filteredServices, setFilteredServices] = useState<Service[]>([]);

  // Simula la carga de datos aplicando filtros por categoría
  const loadData = (category: string | null, isSilent = false) => {
  return new Promise<void>((resolve) => {
    if (!isSilent) {
      setStatus('loading');
    } else {
      setFilteredServices([]);
    }
    setTimeout(() => {
      const simulateError = category === 'Error';
      if (simulateError) {
        setStatus('error');
        setFilteredServices([]);
      } else {
        if (!category || category === 'Todos') {
          setFilteredServices(services);
        } else {
          const filtered = services.filter(s => s.category === category);
          setFilteredServices(filtered);
        }
        setStatus('success');
      }
      resolve();
    }, 1000);
  });
};



  // Carga inicial de todos los servicios al montar el componente
  useEffect(() => {
    loadData('Todos');
  }, []);

  // Manejador para el cambio de categoría en los filtros
  const handleSelectCategory = (category: string | null) => {
    setSelectedCategory(category);
    loadData(category);
  };

  // Filtra los servicios destacados (rating igual o mayor a 4.7)
  const topServices = services.filter(s => s.rating >= 4.7);

  const flatListRef = useRef<FlatList>(null);
  const [currentTopIndex, setCurrentTopIndex] = useState(0);
  const AUTO_SCROLL_INTERVAL = 4000; 

  useEffect(() => {
    // Si no hay servicios recomendados, o solo hay uno, no hacemos auto-scroll
    if (!topServices || topServices.length <= 1 || !flatListRef.current) return;

    // Temporizador
    const interval = setInterval(() => {
      setCurrentTopIndex((prevIndex) => {
        // Calcular el siguiente índice. Si llegamos al final, volvemos a 0
        const nextIndex = (prevIndex + 1) % topServices.length;
        
        flatListRef.current?.scrollToIndex({
          index: nextIndex,
          animated: true,
          viewPosition: 0,
        });

        return nextIndex;
      });
    }, AUTO_SCROLL_INTERVAL);

    return () => clearInterval(interval);
  }, [topServices.length]);

  const CARD_WIDTH = 200; 
  const CARD_GAP = 12;   

  const getItemLayout = (
    data: ArrayLike<any> | null | undefined, 
    index: number
  ) => ({
    length: CARD_WIDTH, 
    offset: (CARD_WIDTH + CARD_GAP) * index, 
    index,
  });

  // Renderiza de forma condicional el listado según el estado actual (loading, error o success)
  const renderResultsFilters = () => {
    if (status === 'loading') {
      return (
        <View style={styles.statusMessageContainer}>
          <ActivityIndicator size="large" color="#7fac75" />
          <Text style={styles.statusText}>Actualizando servicios...</Text>
        </View>
      );
    }

    if (status === 'error') {
      return (
        <View style={styles.statusMessageContainer}>
          <Text style={[styles.statusText, { color: '#C53030', fontWeight: 'bold' }]}>
            Ocurrió un error al filtrar los servicios.
          </Text>
          <Pressable 
            style={({ pressed }) => [
              styles.retryButton,
              pressed && styles.retryButtonPressed
            ]} 
            onPress={() => loadData(selectedCategory)}
          >
            <Text style={styles.retryButtonText}>Reintentar</Text>
          </Pressable>
        </View>
      );
    }

    return (
      <View>
        {filteredServices.length > 0 ? (
          filteredServices.map((item) => (
            <Card key={item.id} service={item} mode="default" />
          ))
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.description}>
              No se encontraron servicios para la categoría seleccionada.
            </Text>
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Se utiliza el componente CustomScroll vacío como scroll principal para poder unificar 
        las listas horizontales y verticales sin romper el scroll nativo.
      */}
      <CustomScroll
        style={styles.mainScroll}
        onRefreshAction={() => loadData(selectedCategory, true)}
      >
        <View style={{ paddingTop: 16 }}>
          {/* CAROUSEL HORIZONTAL */}
          {topServices.length > 0 && (
            <View style={{ marginBottom: 16 }}>
              <Text style={styles.title}>Top Servicios Recomendados</Text>
              <FlatList
                horizontal
                showsHorizontalScrollIndicator={false}
                data={topServices}
                ref={flatListRef}
                getItemLayout={getItemLayout}
                onScrollToIndexFailed={(info) => {
                    console.warn("Scroll failed:", info);
                    flatListRef.current?.scrollToOffset({ offset: info.averageItemLength * info.index, animated: true });
                }}
                keyExtractor={(item) => `top-${item.id}`}
                renderItem={({ item }) => <Card service={item} mode="top" />}
                contentContainerStyle={{ padding: 5, paddingTop: 5, paddingRight: 16, gap: 12 }}
              />
            </View>
          )}

          {/* SECCIÓN PRINCIPAL DE FILTROS Y RESULTADOS */}
          <Text style={[styles.title, { marginTop: 8 }]}>
            Encuentra los mejores servicios cerca de ti
          </Text>
          <Filters selectedCategory={selectedCategory} handleSelectCategory={handleSelectCategory} />
          
          <View style={{ marginTop: 16 }}>
            {renderResultsFilters()}
          </View>
        </View>
      </CustomScroll>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  headerContainer: {
    backgroundColor: '#7fac75',
    paddingTop: Platform.OS === 'ios' ? 50 : 50,
    paddingBottom: 15,
  },
  mainScroll: {
    padding: 16,
    paddingBottom: 40,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 16,
    fontFamily: Platform.OS === 'android' ? 'sans-serif-condensed' : 'Helvetica Neue',
  },
  description: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
  },
  messageCenter: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    gap: 12,
  },
  statusText: {
    fontSize: 16,
    color: '#4A5568',
    textAlign: 'center',
  },
  emptyContainer: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  tabFilters: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
    flexWrap: 'wrap',
  },
  statusMessageContainer: {
    paddingVertical: 40,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  retryButton: {
    backgroundColor: '#7fac75',
    paddingHorizontal: 24,
    paddingVertical: 12,     
    borderRadius: 8,
    marginTop: 8,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2, 
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  retryButtonPressed: {
    opacity: 0.85,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ServicesSearch;