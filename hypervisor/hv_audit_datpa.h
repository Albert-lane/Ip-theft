#pragma once
#include <stdint.h>
#include <stdbool.h>
#include <stddef.h>

#define DATPA_MAX_LOGS 512

typedef struct {
    uint64_t timestamp_ns;
    uint64_t vm_id;
    char event_type[32];
    char details[128];
    uint8_t rolling_sha256[32];
} datpa_audit_record_t;

bool hv_audit_datpa_init(void);
void hv_audit_datpa_record_event(uint64_t vm_id, const char *event_type, const char *details);
void hv_audit_datpa_record_syscall(uint64_t vm_id, uint32_t syscall_num, uint64_t arg1, uint64_t arg2);
bool hv_audit_datpa_integrity_sweep(void);

size_t hv_audit_datpa_get_record_count(void);
const datpa_audit_record_t *hv_audit_datpa_get_record(size_t index);
void hv_audit_datpa_export_json(const char *filepath);
