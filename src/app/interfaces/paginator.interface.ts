import { Product } from './product.interface';
import { Provider } from './provider.interface';
import { Order } from './order.interface';

export interface DataPaginator {
  number: number;
  size: number;
  totalElements: number;
  sort: string;
  last: boolean;
  numberOfElements: number;
  totalPages: number;
  first: boolean;
}

export interface ListResponse extends DataPaginator {
  content: Product[] | Provider[] | Order[];
}

export interface Paginator {
  data: Product[] | Provider[];
  dataPaginator: DataPaginator;
  date?: string;
}
