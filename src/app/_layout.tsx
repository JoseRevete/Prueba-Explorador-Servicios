import { Stack } from 'expo-router';
import React from 'react';
import { View, Text, Image, StyleSheet, Platform } from 'react-native';

export default function Layout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: '#7fac75',
        },
        headerTintColor: '#FFFFFF',
        headerTitleAlign: 'center',
        headerTitle: (props) => (
          <View style={styles.headerRow}>
            <Image
              source={require('../../assets/iconService.png')}
              style={styles.icon}
            />
            <Text style={styles.headerText}>
              {props.children}
            </Text>
          </View>
        ),
      }}
    >
      <Stack.Screen name="index" options={{ title: 'Explorador de Servicios' }} />
      <Stack.Screen name="service/[id]" options={{ title: 'Detalle del Servicio' }} />
      <Stack.Screen name="form/form" options={{ title: 'Formulario de Solicitud' }} />
    </Stack>
  );
}

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  headerText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
    fontFamily: Platform.OS === 'android' ? 'sans-serif-condensed' : 'Helvetica Neue',
    letterSpacing: 0.5,
  },
  icon: {
    width: 32,
    height: 32,
  },
});