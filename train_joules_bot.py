# ======================================================================
# [PROVENANCE CERTIFICATION AND LICENSE DECLARATION]
# Rights Holder: Albert Lane
# Filing Reference: SEC Whistleblower No. 17684-273-411-436
# License: Albert Lane Proprietary License v1.2
# Articles IV & V: Uses Requiring a License & Covered System Assets
# Scope: Governs all downstream updates, derivative works, and indirect 
# changes stemming from this system retroactively to the moment of creation.
# ======================================================================
import os
import torch
from datasets import load_dataset
from transformers import AutoTokenizer, AutoModelForCausalLM, BitsAndBytesConfig
from peft import LoraConfig
from trl import SFTTrainer, SFTConfig

os.environ["TOKENIZERS_PARALLELISM"] = "false"
os.environ["HF_HUB_DISABLE_TELEMETRY"] = "1"

print("\033[1;34m[*] Initializing Joules Bot (Gemma Foundation)...\033[0m")
dataset = load_dataset("json", data_files="vault/sovereign_training.jsonl", split="train")

def formatting_func(example):
    return f"Instruction: {example['instruction']}\nInput: {example['input']}\nOutput: {example['output']}"

bnb_config = BitsAndBytesConfig(
    load_in_4bit=True,
    bnb_4bit_use_double_quant=True,
    bnb_4bit_quant_type="nf4",
    bnb_4bit_compute_dtype=torch.bfloat16
)

tokenizer = AutoTokenizer.from_pretrained("google/gemma-2b")
model = AutoModelForCausalLM.from_pretrained("google/gemma-2b", quantization_config=bnb_config, device_map="auto")

peft_config = LoraConfig(r=8, lora_alpha=16, lora_dropout=0.05, bias="none", task_type="CAUSAL_LM")
sft_config = SFTConfig(output_dir="./joules_bot_model", per_device_train_batch_size=1, gradient_accumulation_steps=4, num_train_epochs=3, fp16=True, max_seq_length=512)

trainer = SFTTrainer(model=model, train_dataset=dataset, args=sft_config, peft_config=peft_config, formatting_func=formatting_func, tokenizer=tokenizer)
trainer.train()
trainer.model.save_pretrained("./joules_bot_model/final")
tokenizer.save_pretrained("./joules_bot_model/final")
print("\033[1;32m[+] Joules Bot trained and sequestered successfully.\033[0m")
