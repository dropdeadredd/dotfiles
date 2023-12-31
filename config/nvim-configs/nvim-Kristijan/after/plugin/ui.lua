local utils = require('partials.utils')
local ui = {
  last_select = {},
  last_input = {},
}

local function add_title_to_win(winnr, bufnr, title)
  vim.cmd.redraw()
  local title_bufnr = vim.api.nvim_create_buf(false, true)
  vim.api.nvim_buf_set_lines(title_bufnr, 0, -1, true, { (' %s'):format(vim.trim(title)) })
  local title_winnr = vim.api.nvim_open_win(title_bufnr, false, {
    relative = 'win',
    win = winnr,
    width = vim.trim(title):len() + 2,
    height = 1,
    row = -1,
    col = 1,
    focusable = false,
    zindex = 151,
    style = 'minimal',
    noautocmd = true,
  })
  vim.api.nvim_create_autocmd('WinClosed', {
    buffer = bufnr,
    callback = function()
      vim.api.nvim_win_close(title_winnr, true)
    end,
  })
end

local function get_win_width(value_length, opts)
  return math.max(value_length + 10, (opts.prompt and opts.prompt:len() + 10 or 0))
end

vim.ui.select = function(items, opts, on_choice)
  vim.validate({
    items = { items, 'table', false },
    on_choice = { on_choice, 'function', false },
  })
  opts = opts or {}
  local choices = {}
  local format_item = opts.format_item or tostring
  local longest_item = 0
  for i, item in pairs(items) do
    local choice = string.format('%d. %s ', i, format_item(item))
    table.insert(choices, choice)
    longest_item = math.max(longest_item, choice:len())
  end

  ui.last_select = {
    items = items,
    on_choice = on_choice,
  }

  local eventignore = vim.opt.eventignore:get()
  vim.opt.eventignore:append('WinLeave')
  local bufnr, winnr = vim.lsp.util.open_floating_preview(choices, '', {
    border = 'rounded',
  })

  vim.api.nvim_win_set_config(winnr, {
    width = get_win_width(longest_item, opts),
  })

  if opts.prompt then
    add_title_to_win(winnr, bufnr, opts.prompt)
  end

  vim.api.nvim_set_current_win(winnr)
  if vim.fn.mode():lower() == 'v' then
    vim.api.nvim_feedkeys(utils.esc('<Esc>'), 'n', false)
  end
  vim.keymap.set('n', '<CR>', ui.on_select, { buffer = bufnr })
  vim.opt.eventignore = eventignore
end

vim.ui.input = function(opts, on_confirm)
  vim.validate({
    on_confirm = { on_confirm, 'function', false },
  })
  opts = opts or {}
  local current_val = opts.default or ''
  local win_width = get_win_width(current_val:len(), opts)
  local eventignore = vim.opt.eventignore:get()
  vim.opt.eventignore:append('WinLeave')
  local bufnr, winnr = vim.lsp.util.open_floating_preview({ current_val }, '', {
    height = 1,
    border = 'rounded',
    width = win_width,
    wrap = false,
  })

  if opts.prompt then
    add_title_to_win(winnr, bufnr, opts.prompt)
  end

  ui.last_input = {
    val = current_val,
    on_confirm = on_confirm,
  }
  vim.api.nvim_win_set_config(winnr, { width = win_width })
  vim.api.nvim_set_current_win(winnr)
  vim.api.nvim_buf_set_option(bufnr, 'modifiable', true)
  vim.api.nvim_win_set_option(winnr, 'sidescrolloff', 0)
  require('cmp').setup.buffer({ enabled = false })
  vim.keymap.set('i', '<CR>', ui.on_input, { buffer = bufnr })
  vim.defer_fn(function()
    vim.cmd.startinsert({ bang = true })
    vim.opt.eventignore = eventignore
  end, 10)
end

function ui.on_select()
  local item = ui.last_select.items[vim.fn.line('.')]
  vim.api.nvim_win_close(0, true)
  if not item then
    return ui.last_select.on_choice(nil, nil)
  end

  return ui.last_select.on_choice(item, vim.fn.line('.'))
end

function ui.on_input()
  local input = vim.trim(vim.fn.getline('.'))
  vim.api.nvim_win_close(0, true)
  vim.api.nvim_feedkeys(utils.esc('<Esc>'), 'i', true)

  if #input > 0 then
    return ui.last_input.on_confirm(input)
  end
  return ui.last_input.on_confirm(nil)
end

return ui
