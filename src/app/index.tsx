import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Platform, FlatList, ActivityIndicator, Pressable } from 'react-native';
import { services } from '../data/Services';
import { Service } from '../types/service';
import Card from '../components/Card';
import Filters from '../components/Filters';

function ServicesSearch() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>('Todos');
  const [status, setStatus] = useState<'loading' | 'error' | 'success'>('loading');
  const [filteredServices, setFilteredServices] = useState<Service[]>([]);

  // Simula la carga de datos aplicando filtros por categoría
  const loadData = (category: string | null) => {
    setStatus('loading');
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
    }, 1200);
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
      {/* Se utiliza una FlatList vacía como scroll principal para poder unificar 
        las listas horizontales y verticales sin romper el scroll nativo.
      */}
      <FlatList
        data={[]}
        keyExtractor={(_, index) => index.toString()}
        renderItem={null}
        contentContainerStyle={styles.mainScroll}
        ListHeaderComponent={
          <View style={{ paddingTop: 16 }}>
            
            {/* CAROUSEL DE SERVICIOS RECOMENDADOS (TOP) */}
            {topServices.length > 0 && (
              <View style={{ marginBottom: 16 }}>
                <Text style={styles.title}>Top Servicios Recomendados</Text>
                <FlatList
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  data={topServices}
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
        }
      />
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