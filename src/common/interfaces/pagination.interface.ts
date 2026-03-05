/** Risposta paginata per le GET che restituiscono liste */
export interface PaginatedResponse<T> {
  /** Array degli elementi restituiti */
  result: T[];
  /** Numero totale di elementi filtrati */
  totalCount: number;
  /** Numero totale di pagine */
  totalPages: number;
  /** Indica se è la prima pagina */
  isFirstPage: boolean;
  /** Indica se è l'ultima pagina */
  isLastPage: boolean;
  /** Pagina corrente */
  currentPage: number;
  /** Pagine successive */
  nextPage: number | null;
  /** Pagine precedenti */
  prevPage: number | null;
}
