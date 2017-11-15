export interface MenuItemLink {
  depth: number,
  description: string,
  external: 0 | 1,
  has_children: 0 | 1,
  hidden: 0 | 1,
  href: string
  localized_options: {attributes: {title: string}},
  mlid: number,
  options: {attributes: {title: string}},
  path: string,
  path_alias: boolean,
  plid: number,
  title: string,
  weight: number,
}

export interface MenuItem {
  children: {[key: string]: MenuItem},
  link: MenuItemLink,
}

export interface Menu {
  name: string,
  tree: {[key: string]: MenuItem},
}


