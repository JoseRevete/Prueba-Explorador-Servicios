import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TextInput, 
  Pressable, 
  ActivityIndicator, 
  Platform, 
  ScrollView,
  Alert
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { FormErrors } from '../../types/form';

export default function RequestFormScreen() {
  const { serviceName } = useLocalSearchParams();
  const router = useRouter();
  
  const [isLoadingScreen, setIsLoadingScreen] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Estados locales para los campos del formulario
  const [nombre, setNombre] = useState('');
  const [telefono, setTelefono] = useState('');
  const [fecha, setFecha] = useState('');

  // Estado para el manejo de errores de validación
  const [errors, setErrors] = useState<FormErrors>({});

  // Helper para verificar si la fecha ingresada es anterior al día de hoy
  const isPastDate = (inputDate: string): boolean => {
    const [day, month, year] = inputDate.split('/').map(Number);
    const fechaIngresada = new Date(year, month - 1, day);
    const today = new Date();
    today.setHours(0, 0, 0, 0); 
    return fechaIngresada < today;
  };

  // Efecto de carga inicial simulada para transiciones fluidas de UI
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

  // Efecto encargado de validar en tiempo real los campos del formulario
  useEffect(() => {
    const newErrors: FormErrors = {};

    // Validar longitud del nombre
    if (nombre.trim() !== '' && nombre.trim().length < 3) {
      newErrors.nombre = 'El nombre debe tener al menos 3 caracteres.';
    }

    // Validar caracteres y longitud del número de teléfono
    const phoneRegex = /^[0-9]+$/;
    if (telefono !== '' && !phoneRegex.test(telefono)) {
      newErrors.telefono = 'El teléfono solo debe contener números.';
    } else if (telefono !== '' && (telefono.length < 7 || telefono.length > 15)) {
      newErrors.telefono = 'Número inválido (debe tener entre 7 y 15 dígitos).';
    }

    // Validar formato de fecha (DD/MM/AAAA) y que no sea del pasado
    const dateRegex = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/;
    if (fecha !== '' && !dateRegex.test(fecha)) {
      newErrors.fecha = 'Formato inválido. Use el formato DD/MM/AAAA.';
    } else if (fecha !== '' && isPastDate(fecha)) {
      newErrors.fecha = 'La fecha no puede ser en el pasado.';
    }

    setErrors(newErrors);
  }, [nombre, telefono, fecha]);

  // Bandera que determina si el formulario es inválido o está incompleto
  const isFormInvalid = 
    nombre.trim() === '' || 
    telefono.trim() === '' || 
    fecha.trim() === '' || 
    Object.keys(errors).length > 0;

  // Manejador del envío del formulario con simulación de respuesta HTTP
  const handleSubmit = () => {
    if (isFormInvalid) return;

    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      const esExitoso = Math.random() > 0.15; // 85% de probabilidad de éxito

      if (esExitoso) {
        Alert.alert(
          '¡Solicitud Exitosa!',
          `Tu solicitud para "${serviceName}" ha sido procesada correctamente.`,
          [{ text: 'Excelente', onPress: () => router.dismissAll() }]
        );
      } else {
        Alert.alert(
          'Error de Conexión',
          'No se pudo enviar la solicitud en este momento. Inténtalo de nuevo.',
          [{ text: 'Entendido' }]
        );
      }
    }, 1500);
  };

  // Renderizado del estado de carga global de la pantalla
  if (isLoadingScreen) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#7fac75" />
        <Text style={styles.loadingText}>Preparando formulario...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <Text style={styles.title}>Formulario de Solicitud</Text>
      <Text style={styles.subtitle}>
        Servicio seleccionado: <Text style={styles.highlight}>{serviceName}</Text>
      </Text>

      {/* Campo: Nombre */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Nombre Completo *</Text>
        <TextInput
          style={[styles.input, errors.nombre ? styles.inputError : null]}
          placeholder="Ej. Jose Revete"
          placeholderTextColor="#A0AEC0"
          value={nombre}
          onChangeText={setNombre}
          editable={!isSubmitting}
        />
        {errors.nombre ? <Text style={styles.errorMessage}>{errors.nombre}</Text> : null}
      </View>

      {/* Campo: Teléfono */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Teléfono de Contacto *</Text>
        <TextInput
          style={[styles.input, errors.telefono ? styles.inputError : null]}
          placeholder="Ej. 04123798584"
          placeholderTextColor="#A0AEC0"
          keyboardType="numeric"
          value={telefono}
          onChangeText={setTelefono}
          editable={!isSubmitting}
        />
        {errors.telefono ? <Text style={styles.errorMessage}>{errors.telefono}</Text> : null}
      </View>

      {/* Campo: Fecha de visita */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Fecha para la visita (DD/MM/AAAA)</Text>
        <TextInput
          style={[styles.input, errors.fecha ? styles.inputError : null]}
          placeholder="Ej. 22/07/2002"
          placeholderTextColor="#A0AEC0"
          value={fecha}
          onChangeText={setFecha}
          maxLength={10}
          editable={!isSubmitting}
        />
        {errors.fecha ? <Text style={styles.errorMessage}>{errors.fecha}</Text> : null}
      </View>

      {/* Botón de envío con feedback interactivo */}
      <Pressable
        disabled={isFormInvalid || isSubmitting}
        style={({ pressed }) => [
          styles.submitButton,
          isFormInvalid ? styles.disabledButton : null,
          pressed && !isFormInvalid ? styles.pressedButton : null
        ]}
        onPress={handleSubmit}
      >
        {isSubmitting ? (
          <View style={styles.loaderRow}>
            <ActivityIndicator size="small" color="#FFFFFF" />
            <Text style={styles.buttonText}>Enviando solicitud...</Text>
          </View>
        ) : (
          <Text style={styles.buttonText}>Confirmar Solicitud</Text>
        )}
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollContent: {
    padding: 24,
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
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1A202C',
    marginBottom: 4,
    fontFamily: Platform.OS === 'android' ? 'sans-serif-condensed' : 'System',
  },
  subtitle: {
    fontSize: 15,
    color: '#4A5568',
    marginBottom: 24,
  },
  highlight: {
    fontWeight: 'bold',
    color: '#7fac75',
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2D3748',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CBD5E0',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: Platform.OS === 'ios' ? 14 : 10,
    fontSize: 16,
    color: '#1A202C',
  },
  inputError: {
    borderColor: '#E53E3E',
    backgroundColor: '#FFF5F5',
  },
  errorMessage: {
    color: '#E53E3E',
    fontSize: 13,
    marginTop: 6,
    fontWeight: '500',
  },
  submitButton: {
    backgroundColor: '#7fac75',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
    shadowColor: '#7fac75',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 2,
  },
  disabledButton: {
    backgroundColor: '#E2E8F0',
    shadowOpacity: 0,
    elevation: 0,
  },
  pressedButton: {
    opacity: 0.85,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
});