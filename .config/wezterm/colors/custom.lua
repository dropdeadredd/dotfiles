local colorscheme = {
	foreground = "#dcd7ba",
	background = "#1f1f28",
	cursor_bg = "#c8c093",
	cursor_fg = "#c8c093",
	cursor_border = "#dcd7ba",
	selection_fg = "#c8c093",
	selection_bg = "#2d4f67",
	scrollbar_thumb = "#16161d",
	split = "#16161d",
  visual_bell = "#dcd7ba",
	ansi = {
      "#090618",
      "#c34043",
      "#76946a",
      "#c0a36e",
      "#7e9cd8",
      "#957fb8",
      "#6a9589",
      "#c8c093"
  },
  brights = {
      "#727169",
      "#e82424",
      "#98bb6c",
      "#e6c384",
      "#7fb4ca",
      "#938aa9",
      "#7aa89f",
      "#dcd7ba"
  },
  indexed = { [16] = "#ffa066", [17] = "#ff5d62" },
  tab_bar = {
    background = "#1f1f28",
    active_tab = {
      bg_color = "#ffa066",
      fg_color = "#090618"
    },
    inactive_tab = {
      bg_color = "#6a9589",
      fg_color = "#dcd7ba"
    },
    inactive_tab_hover = {
      bg_color = "#7e9cd8",
      fg_color = "#dcd7ba"
    },
    new_tab = {
       bg_color = "#e6c384",
       fg_color = "#090618"
    },
    new_tab_hover = {
       bg_color = "#c34043",
       fg_color = "#dcd7ba",
       italic = false
    }
  },
}

return colorscheme
