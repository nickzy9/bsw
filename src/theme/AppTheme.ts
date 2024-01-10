export interface ColorScheme {
  primary: string;
  secondary: string;
  tertiary: string;
  background: string;
}

export interface BaseLayout {
  padding: number;
  lastElementBottomPadding: number;
  margin: number;
  numberOfCellInRow: number;
  cornerRadius1: number;
  cornerRadius2: number;
}

export interface FontSzie {
  title: number;
  subTitle: number;
  small: number;
}

export interface AppTheme {
  color: ColorScheme;
  baseLayout: BaseLayout;
  fontSize: FontSzie;
}
