import React, { useState } from 'react';
import { ScrollView, RefreshControl, StyleSheet, ViewStyle, StyleProp } from 'react-native';

interface CustomScrollProps {
  children: React.ReactNode;
  onRefreshAction?: () => Promise<void> | void;
  style?: StyleProp<ViewStyle>;
}

export default function CustomScroll({ children, onRefreshAction, style }: CustomScrollProps) {
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    if (!onRefreshAction) return;
    setRefreshing(true);
    await onRefreshAction();
    setRefreshing(false);
  };

  return (
    <ScrollView
      style={styles.outerScroll} 
      contentContainerStyle={[styles.container, style]}
      
      overScrollMode="always"
      bounces={true}
      refreshControl={
        onRefreshAction ? (
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={['#7fac75']}
            tintColor={'#7fac75'}
          />
        ) : undefined
      }
    >
      {children}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  outerScroll: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  container: {},
});