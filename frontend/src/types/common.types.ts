export interface ApiError {
  message: string;
  statusCode?: number;
  detail?: string;
}

export interface SelectOption {
  value: string;
  label: string;
}
