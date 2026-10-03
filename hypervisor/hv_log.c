#include "hv_log.h"
#include <stdio.h>
#include <time.h>

static void hv_log_v(const char *level, const char *fmt, va_list ap) {
    time_t now = time(NULL);
    char buf[32];
    strftime(buf, sizeof(buf), "%H:%M:%S", gmtime(&now));
    printf("[%s UTC] [%-5s] [LANE-HV] ", buf, level);
    vprintf(fmt, ap);
    printf("\n");
    fflush(stdout);
}

void hv_log_init(void) {
    printf("[HV_LOG] Sovereign Hypervisor Serial Logging & DATPA Audit Stream Initialized\n");
    fflush(stdout);
}

void hv_log_info(const char *fmt, ...) {
    va_list ap; va_start(ap, fmt);
    hv_log_v("INFO", fmt, ap);
    va_end(ap);
}

void hv_log_warn(const char *fmt, ...) {
    va_list ap; va_start(ap, fmt);
    hv_log_v("WARN", fmt, ap);
    va_end(ap);
}

void hv_log_debug(const char *fmt, ...) {
    va_list ap; va_start(ap, fmt);
    hv_log_v("DEBUG", fmt, ap);
    va_end(ap);
}

void hv_log_fatal(const char *fmt, ...) {
    va_list ap; va_start(ap, fmt);
    hv_log_v("FATAL", fmt, ap);
    va_end(ap);
}
