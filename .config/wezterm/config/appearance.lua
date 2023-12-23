local wezterm = require('wezterm')
local colors = require('colors.custom')
-- local fonts = require('config.fonts')

return {
   animation_fps = 60,
   max_fps = 60,
   front_end = 'WebGpu',
   webgpu_power_preference = 'HighPerformance',
   enable_wayland = true,
   -- color scheme
   colors = colors,

   -- background
   background = {
      {
         source = { Color = "#1f1f28" },
         height = '100%',
         width = '100%',
         opacity = 0.95,
      },
   },

   -- scrollbar
   enable_scroll_bar = true,

   -- tab bar
   enable_tab_bar = true,
   tab_bar_at_bottom = true,
   hide_tab_bar_if_only_one_tab = false,
   use_fancy_tab_bar = true,
   tab_max_width = 15,
   show_tab_index_in_tab_bar = false,
   switch_to_last_active_tab_when_closing_tab = true,

   -- window
   window_padding = {
      left = 5,
      right = 10,
      top = 12,
      bottom = 7,
   },
   window_background_opacity = 0.95,
   window_close_confirmation = 'NeverPrompt',
   window_frame = {
      active_titlebar_bg = "#1f1f28",
      -- font = fonts.font,
      -- font_size = fonts.font_size,
   },
   inactive_pane_hsb = { saturation = 1.0, brightness = 1.0 },
}
