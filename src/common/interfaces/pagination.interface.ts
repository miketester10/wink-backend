/** Risposta paginata per le GET che restituiscono liste */
export interface PaginatedResponse<T> {
  /** Array degli elementi restituiti */
  result: T[];
  /** Numero totale di elementi filtrati */
  totalCount: number;
  /** Numero totale di pagine */
  totalPages: number;
  /** Pagina corrente */
  currentPage: number;
  /** Indica se esiste una pagina successiva */
  hasNextPage: boolean;
  /** Indica se esiste una pagina precedente */
  hasPrevPage: boolean;
}
