local api = vim.api
local bo = vim.bo
local utils = require("utils")

-- will format file before saving based on attached lsp capabilities
api.nvim_create_augroup("lsp", { clear = true })
api.nvim_create_autocmd("BufWritePre", {
  group = "lsp",
  pattern = "*",
  callback = utils.auto_format_lsp,
})

-- yaml configurations
local bufferOpts = function()
  bo.tabstop = 2
  bo.softtabstop = 2
  bo.shiftwidth = 2
  bo.expandtab = true
  vim.wo.cursorcolumn = true
end
api.nvim_create_augroup("yaml", { clear = true })
api.nvim_create_autocmd({ "BufEnter", "BufWinEnter" }, {
  group = "yaml",
  pattern = { "*.yaml", "*.yml" },
  callback = bufferOpts,
})
api.nvim_create_autocmd({ "BufLeave", "BufWinLeave" }, {
  group = "yaml",
  pattern = { "*.yaml", "*.yml" },
  callback = function() vim.wo.cursorcolumn = false end,
})

-- lua configurations
api.nvim_create_augroup("lua", { clear = true })
api.nvim_create_autocmd({ "BufEnter", "BufWinEnter" }, {
  group = "lua",
  pattern = { "*.lua" },
  callback = bufferOpts,
})
api.nvim_create_autocmd({ "BufLeave", "BufWinLeave" }, {
  group = "lua",
  pattern = { "*.lua" },
  callback = function() vim.wo.cursorcolumn = false end,
})


-- golang configurations
local goOpts = function()
  bo.tabstop = 4
  bo.softtabstop = 4
  bo.shiftwidth = 4
  bo.expandtab = false
end
api.nvim_create_augroup("golang", { clear = true })
api.nvim_create_autocmd("FileType", {
  group = "golang",
  pattern = "go",
  callback = goOpts,
})


-- markdown configurations
local markdownIn = function()
  bo.textwidth = 70
  vim.wo.wrap = true
end
local markdownOut = function()
  vim.wo.wrap = false
end

api.nvim_create_augroup("markdown", { clear = true })
api.nvim_create_autocmd({ "BufEnter", "BufWinEnter" }, {
  group = "markdown",
  pattern = { "*.md", "*.markdown" },
  callback = markdownIn,
})
api.nvim_create_autocmd({ "BufLeave", "BufWinLeave" }, {
  group = "markdown",
  pattern = { "*.md", "*.markdown" },
  callback = markdownOut,
})

-- -- term configurations
-- vim.cmd[[
-- augroup term
--   autocmd!
--   au TermOpen * setlocal listchars= nonumber norelativenumber signcolumn=no
--   au TermOpen * startinsert
--   au BufEnter,BufWinEnter,WinEnter term://* startinsert
--   au BufLeave term://* stopinsert
-- augroup END
-- ]]
--
