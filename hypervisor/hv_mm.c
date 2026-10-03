#include "hv_mm.h"
#include "hv_log.h"
#include "hv_audit_datpa.h"
#include <stdlib.h>
#include <string.h>

static uint8_t *g_page_pool = NULL;
static bool g_page_bitmap[HV_MAX_PAGES];
static size_t g_allocated_pages = 0;

bool hv_mm_init(void) {
    hv_log_info("Initializing Hypervisor Extended Page Tables (EPT/NPT) and Memory Pool");
    g_page_pool = (uint8_t *)calloc(HV_MAX_PAGES, HV_PAGE_SIZE);
    if (!g_page_pool) {
        hv_log_fatal("Out of memory during hypervisor heap allocation");
        return false;
    }
    memset(g_page_bitmap, 0, sizeof(g_page_bitmap));
    g_allocated_pages = 0;
    hv_log_info("Page pool initialized: %u MB backing memory (%u pages)", 
                (unsigned int)(HV_MAX_PAGES * HV_PAGE_SIZE / (1024 * 1024)), HV_MAX_PAGES);
    return true;
}

void *hv_mm_alloc_page(void) {
    for (size_t i = 0; i < HV_MAX_PAGES; i++) {
        if (!g_page_bitmap[i]) {
            g_page_bitmap[i] = true;
            g_allocated_pages++;
            void *p = (void *)(g_page_pool + (i * HV_PAGE_SIZE));
            memset(p, 0, HV_PAGE_SIZE);
            return p;
        }
    }
    hv_log_warn("hv_mm_alloc_page: out of pages in pool");
    return NULL;
}

void hv_mm_free_page(void *page) {
    if (!page || !g_page_pool) return;
    uintptr_t diff = (uintptr_t)page - (uintptr_t)g_page_pool;
    size_t idx = diff / HV_PAGE_SIZE;
    if (idx < HV_MAX_PAGES && g_page_bitmap[idx]) {
        g_page_bitmap[idx] = false;
        if (g_allocated_pages > 0) g_allocated_pages--;
    }
}

hv_page_table_t *hv_mm_create_pt_root(void) {
    hv_page_table_t *pt = (hv_page_table_t *)hv_mm_alloc_page();
    if (!pt) return NULL;
    // Map identity lower range for hypervisor/guest control
    for (uint64_t i = 0; i < 512; i++) {
        uint64_t addr = i * 0x200000ULL; // 2MB identity chunks
        pt->entries[i] = addr | HV_PTE_PRESENT | HV_PTE_READABLE | HV_PTE_WRITABLE | HV_PTE_EXECUTABLE;
    }
    return pt;
}

bool hv_mm_map_page(hv_page_table_t *pt, uint64_t gpa, uint64_t hpa, uint64_t flags) {
    if (!pt) return false;
    uint64_t idx = (gpa / HV_PAGE_SIZE) % 512;
    pt->entries[idx] = (hpa & ~0xFFFULL) | (flags & 0xFFFULL) | HV_PTE_PRESENT;
    return true;
}

uint64_t hv_mm_translate(hv_page_table_t *pt, uint64_t gpa) {
    if (!pt) return 0;
    uint64_t idx = (gpa / HV_PAGE_SIZE) % 512;
    uint64_t entry = pt->entries[idx];
    if (!(entry & HV_PTE_PRESENT)) return 0;
    return (entry & ~0xFFFULL) | (gpa & 0xFFFULL);
}

size_t hv_mm_get_allocated_bytes(void) {
    return g_allocated_pages * HV_PAGE_SIZE;
}
