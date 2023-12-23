local status_ok, alpha = pcall(require, "alpha")
if not status_ok then
  return
end

local dashboard = require("alpha.themes.dashboard")

dashboard.section.header.val = {
  "                                                         ",
  " █████╗ ██╗      █████╗ ███╗   ██╗██╗   ██╗██╗███╗   ███╗",
  "██╔══██╗██║     ██╔══██╗████╗  ██║██║   ██║██║████╗ ████║",
  "███████║██║     ███████║██╔██╗ ██║██║   ██║██║██╔████╔██║",
  "██╔══██║██║     ██╔══██║██║╚██╗██║╚██╗ ██╔╝██║██║╚██╔╝██║",
  "██║  ██║███████╗██║  ██║██║ ╚████║ ╚████╔╝ ██║██║ ╚═╝ ██║",
  "╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝╚═╝  ╚═══╝  ╚═══╝  ╚═╝╚═╝     ╚═╝",
  "                                                         ",
}

dashboard.section.buttons.val = {

  dashboard.button("<space> r", "🚽 Recently used files", ":Telescope oldfiles <CR>"),
  dashboard.button("<space> f", "🎪 Find file", ":Telescope find_files <CR>"),
  dashboard.button("<space> w", "👀 Find word", ":Telescope live_grep <CR>"),
  dashboard.button("<leader> m", "🚪 Key mapping", ":e ~/.config/nvim-AlanVim/lua/general/mappings.lua <CR>"),
  dashboard.button("<leader> p", "🚃 Packages", ":e ~/.config/nvim-AlanVim/lua/packages.lua <CR>"),
}

dashboard.section.footer.val = { "make America great again" }

dashboard.config.opts.noautocmd = true

alpha.setup(dashboard.opts)
