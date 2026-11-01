import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * Custom Hook `useSimulatedFetch` (Syarat Level 9 & Level 10).
 * Mensimulasikan pengambilan data JSON lokal secara asinkron layaknya pemanggilan REST API,
 * lengkap dengan state `loading`, `isRefreshing`, `error`, fungsi `retry`, dan simulasi gangguan jaringan.
 *
 * @param {Function|Object} source - Fungsi pengambil data atau objek JSON statis
 * @param {{ delay?: number }} options - Durasi simulasi latensi jaringan dalam milidetik
 */
export function useSimulatedFetch(source, options = {}) {
  const { delay = 420 } = options;

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const isMountedRef = useRef(true);
  const timerRef = useRef(null);
  const sourceRef = useRef(source);
  sourceRef.current = source;

  const executeFetch = useCallback(
    ({ silent = false, forceError = false } = {}) => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }

      if (silent) {
        setIsRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);

      timerRef.current = setTimeout(async () => {
        try {
          if (forceError) {
            throw new Error(
              'Simulasi gangguan jaringan: Gagal memuat sumber data JSON. Silakan tekan tombol Coba Lagi.'
            );
          }

          const currentSource = sourceRef.current;
          const resolvedData =
            typeof currentSource === 'function' ? await currentSource() : currentSource;

          if (!resolvedData) {
            throw new Error('Data tidak ditemukan atau kosong.');
          }

          if (isMountedRef.current) {
            setData(resolvedData);
            setError(null);
          }
        } catch (err) {
          if (isMountedRef.current) {
            setError(err instanceof Error ? err.message : 'Terjadi kesalahan saat memuat data.');
          }
        } finally {
          if (isMountedRef.current) {
            setLoading(false);
            setIsRefreshing(false);
          }
        }
      }, delay);
    },
    [delay]
  );

  useEffect(() => {
    isMountedRef.current = true;
    executeFetch({ silent: false, forceError: false });

    return () => {
      isMountedRef.current = false;
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [executeFetch]);

  const retry = useCallback(() => {
    executeFetch({ silent: false, forceError: false });
  }, [executeFetch]);

  const refresh = useCallback(() => {
    executeFetch({ silent: true, forceError: false });
  }, [executeFetch]);

  const simulateError = useCallback(() => {
    executeFetch({ silent: false, forceError: true });
  }, [executeFetch]);

  return {
    data,
    loading,
    isRefreshing,
    error,
    retry,
    refresh,
    simulateError,
  };
}

export default useSimulatedFetch;
