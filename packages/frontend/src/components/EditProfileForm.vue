<template>
    <v-card>
        <v-card-title>
            <span class="text-h5">
                {{ initialProfile ? "Edit Profile" : "Create Profile" }}
            </span>
        </v-card-title>
        <v-card-text>
            <v-form ref="form" v-model="formValid">
                <v-text-field
                    variant="outlined"
                    v-model="editedProfile.name"
                    label="Full Name"
                    :rules="[required]"
                />
                <v-date-input
                    v-model="birthDateModel"
                    clearable
                    label="Birth Date"
                    variant="outlined"
                    :rules="[required]"
                />
                <v-text-field
                    variant="outlined"
                    v-model.number="editedProfile.height"
                    label="Height (cm)"
                    type="number"
                    :rules="[required]"
                />
                <v-text-field
                    variant="outlined"
                    v-model.number="editedProfile.weight"
                    label="Weight (kg)"
                    type="number"
                    :rules="[required]"
                />
                <v-select
                    variant="outlined"
                    v-model="editedProfile.gender"
                    :items="genderOptions"
                    label="Gender"
                    :rules="[required]"
                />
                <v-text-field
                    variant="outlined"
                    v-model="editedProfile.profilePictureUrl"
                    label="Profile Picture URL"
                />
            </v-form>
        </v-card-text>
        <v-card-actions>
            <v-spacer />
            <v-btn @click="emitClose">Cancel</v-btn>
            <v-btn color="primary" :disabled="!formValid" @click="saveProfile"> Save </v-btn>
        </v-card-actions>
    </v-card>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";

import type { UserProfile } from "../services/user";

import { required } from "../helpers/form-validators";
import { updateUserProfile } from "../services/user";
import { useAuthStore } from "../stores/auth";
import { useGlobalStore } from "../stores/global";

const props = defineProps<{
    initialProfile: null | UserProfile;
}>();

const emit = defineEmits<{
    (e: "profileSaved", profile: UserProfile): void;
    (e: "close"): void;
}>();

const authStore = useAuthStore();
const globalStore = useGlobalStore();
const genderOptions = ["Male", "Female"];

const editedProfile = ref<UserProfile>({
    birthDate: "",
    gender: "Male",
    height: 0,
    id: authStore.nonNullableUser.uid,
    name: "",
    profilePictureUrl: "",
    weight: 0,
});

if (props.initialProfile) {
    editedProfile.value = { ...props.initialProfile };
}

const form = ref();
const formValid = ref(false);

const birthDateModel = computed({
    get() {
        return editedProfile.value.birthDate ? new Date(editedProfile.value.birthDate) : null;
    },
    set(newValue: Date | null) {
        if (newValue) {
            editedProfile.value.birthDate = newValue.toISOString().split("T")[0];
        } else {
            editedProfile.value.birthDate = "";
        }
    },
});

function emitClose(): void {
    emit("close");
}

async function saveProfile(): Promise<void> {
    try {
        await updateUserProfile(authStore.nonNullableUser.uid, editedProfile.value);
        globalStore.notify("Profile saved successfully!");
        emit("profileSaved", { ...editedProfile.value });
        emit("close");
    } catch (error) {
        globalStore.notifyError("Failed to save profile.");
    }
}
</script>
