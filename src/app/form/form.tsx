import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TextInput, 
  Pressable, 
  ActivityIndicator, 
  Platform, 
  Alert
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { FormErrors } from '../../types/form';
import CustomScroll from '../../components/CustomScroll';
// Importamos el selector de fecha nativo
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker'; 

export default function RequestFormScreen() {
  const { serviceName } = useLocalSearchParams();
  const router = useRouter();
  
  const [isLoadingScreen, setIsLoadingScreen] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Estados de los campos
  const [nombre, setNombre] = useState('');
  const [telefono, setTelefono] = useState('');
  
  // Ahora el estado maneja un objeto Date real o null
  const [fecha, setFecha] = useState<Date | null>(null); 
  const [showDatePicker, setShowDatePicker] = useState(false);

  const [errors, setErrors] = useState<FormErrors>({});

  // Efecto de carga inicial simulada
  useEffect(() => {
    let unmounted = false;
    const timer = setTimeout(() => {
      if (!unmounted) setIsLoadingScreen(false);
    }, 350);

    return () => {
      unmounted = true;
      clearTimeout(timer);
    };
  }, []);

  // Validación en tiempo real (¡Mucho más limpia sin Regex de fechas!)
  useEffect(() => {
    const newErrors: FormErrors = {};

    if (nombre.trim() !== '' && nombre.trim().length < 3) {
      newErrors.nombre = 'El nombre debe tener al menos 3 caracteres.';
    }

    const phoneRegex = /^[0-9]+$/;
    if (telefono !== '' && !phoneRegex.test(telefono)) {
      newErrors.telefono = 'El teléfono solo debe contener números.';
    } else if (telefono !== '' && (telefono.length < 7 || telefono.length > 15)) {
      newErrors.telefono = 'Número inválido (debe tener entre 7 y 15 dígitos).';
    }

    // Si el usuario abrió el formulario y no ha tocado la fecha, no disparamos error inmediatamente
    if (fecha === null && nombre.trim() !== '') {
      // Opcional: Validar si es requerido al intentar enviar
    }

    setErrors(newErrors);
  }, [nombre, telefono, fecha]);

  const isFormInvalid = 
    nombre.trim() === '' || 
    telefono.trim() === '' || 
    fecha === null || 
    Object.keys(errors).length > 0;

  // Formateador sutil para pintar la fecha en la caja de texto simulada
  const getFormattedDate = (date: Date | null): string => {
    if (!date) return '';
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // Manejador del cambio de fecha del componente nativo
  const handleDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    // En Android, la acción de cerrar el modal ocurre al seleccionar
    setShowDatePicker(Platform.OS === 'ios'); 
    
    if (selectedDate) {
      setFecha(selectedDate);
    }
  };

  const handleSubmit = () => {
    if (isFormInvalid) return;
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      const esExitoso = Math.random() > 0.15;

      if (esExitoso) {
        Alert.alert(
          '¡Solicitud Exitosa!',
          `Tu solicitud para "${serviceName}" el día ${getFormattedDate(fecha)} ha sido procesada.`,
          [{ text: 'Excelente', onPress: () => router.dismissAll() }]
        );
      } else {
        Alert.alert(
          'Error de Conexión',
          'No se pudo enviar la solicitud en este momento.',
          [{ text: 'Entendido' }]
        );
      }
    }, 1500);
  };

  if (isLoadingScreen) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#7fac75" />
        <Text style={styles.loadingText}>Preparando formulario...</Text>
      </View>
    );
  }

  return (
    <CustomScroll style={[styles.scrollContent, styles.container]}>
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

      {/* Campo: Fecha de visita (Convertido en un botón táctil elegante) */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Fecha para la visita *</Text>
        <Pressable 
          disabled={isSubmitting}
          onPress={() => setShowDatePicker(true)}
          style={[styles.input, styles.datePressable]}
        >
          <Text style={[styles.dateText, !fecha ? styles.placeholderText : null]}>
            {fecha ? getFormattedDate(fecha) : 'Selecciona una fecha...'}
          </Text>
        </Pressable>
      </View>

      {/* Componente del Selector de Fecha Nativo */}
      {showDatePicker && (
        <DateTimePicker
          value={fecha || new Date()}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          minimumDate={new Date()} // 🌟 Magia: Bloquea automáticamente cualquier día del pasado
          onChange={handleDateChange}
        />
      )}

      {/* Botón de envío */}
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
    </CustomScroll>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F8FAFC',
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 40,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    gap: 12,
  },
  loadingText: { fontSize: 15, color: '#718096', fontWeight: '500' },
  title: { fontSize: 22, fontWeight: 'bold', color: '#1A202C', marginBottom: 4 },
  subtitle: { fontSize: 15, color: '#4A5568', marginBottom: 24 },
  highlight: { fontWeight: 'bold', color: '#7fac75' },
  inputGroup: { marginBottom: 20 },
  label: { fontSize: 14, fontWeight: '600', color: '#2D3748', marginBottom: 8 },
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
  datePressable: {
    justifyContent: 'center',
  },
  dateText: {
    fontSize: 16,
    color: '#1A202C',
  },
  placeholderText: {
    color: '#A0AEC0',
  },
  inputError: { borderColor: '#E53E3E', backgroundColor: '#FFF5F5' },
  errorMessage: { color: '#E53E3E', fontSize: 13, marginTop: 6, fontWeight: '500' },
  submitButton: {
    backgroundColor: '#7fac75',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
  },
  disabledButton: { backgroundColor: '#E2E8F0' },
  pressedButton: { opacity: 0.85 },
  buttonText: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' },
  loaderRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
});