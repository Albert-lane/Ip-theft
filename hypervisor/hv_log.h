#pragma once
#include <stdarg.h>

void hv_log_init(void);
void hv_log_info(const char *fmt, ...);
void hv_log_warn(const char *fmt, ...);
void hv_log_debug(const char *fmt, ...);
void hv_log_fatal(const char *fmt, ...);
