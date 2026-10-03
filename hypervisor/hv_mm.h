#pragma once
#include <stdint.h>
#include <stdbool.h>
#include <stddef.h>

#define HV_PAGE_SIZE               4096
#define HV_LANE_VM_STRIDE_BYTES    17684
#define HV_MAX_PAGES               16384

#define HV_PTE_PRESENT             (1ULL << 0)
#define HV_PTE_READABLE            (1ULL << 1)
#define HV_PTE_WRITABLE            (1ULL << 2)
#define HV_PTE_EXECUTABLE          (1ULL << 3)
#define HV_PTE_SOVEREIGN_LOCKED    (1ULL << 63)

typedef struct hv_page_table {
    uint64_t entries[512];
} hv_page_table_t;

bool hv_mm_init(void);
void *hv_mm_alloc_page(void);
void hv_mm_free_page(void *page);

hv_page_table_t *hv_mm_create_pt_root(void);
bool hv_mm_map_page(hv_page_table_t *pt, uint64_t gpa, uint64_t hpa, uint64_t flags);
uint64_t hv_mm_translate(hv_page_table_t *pt, uint64_t gpa);

size_t hv_mm_get_allocated_bytes(void);
