export enum PizzaSize {
  SMALL = 20,
  MEDIUM = 30,
  LARGE = 40,
}

export enum PizzaType {
  TRADITIONAL = 1,
  THIN = 2,
}

export const mapPizzaType = {
  [PizzaType.TRADITIONAL]: 'Традиционное',
  [PizzaType.THIN]: 'Тонкое',
};
