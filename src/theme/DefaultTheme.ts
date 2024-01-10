import {ColorScheme, BaseLayout, AppTheme, FontSzie} from './AppTheme';

const DEFAULT_COLORS: ColorScheme = {
  primary: '#001C30',
  secondary: '#176B87',
  tertiary: '#DAFFFB',
  background: '#DAFFFB',
};

const DFAULT_BASE_LAYOOUT: BaseLayout = {
  padding: 16,
  margin: 16,
  numberOfCellInRow: 3,
  cornerRadius1: 8,
  cornerRadius2: 16,
  lastElementBottomPadding: 44,
};

const DEFAULT_FONT_SIZE: FontSzie = {
  title: 18,
  subTitle: 15,
  small: 13,
};

export const DEFAULT_THEME: AppTheme = {
  color: DEFAULT_COLORS,
  baseLayout: DFAULT_BASE_LAYOOUT,
  fontSize: DEFAULT_FONT_SIZE,
};
