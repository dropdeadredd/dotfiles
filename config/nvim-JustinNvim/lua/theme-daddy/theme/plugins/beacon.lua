local M = {}

--- @param c Colorscheme The color theme
M.setup = function(c, _, _)
  return {
    Beacon = { bg = c.base.blue },
  }
end

return M
