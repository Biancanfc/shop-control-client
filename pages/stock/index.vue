<template>
  <v-container>
    <v-row justify="space-between" class="mb-5 pb-5 ml-2 mr-2">
      <h2>STOCK</h2>
      <div @click="dialogEditCreate = true, stockCurrent.action = 'create'">
        <c-button text="New product" />
      </div>
    </v-row>
    <v-card>
      <v-card-title>
        <v-spacer style="width:650px"></v-spacer>
        <v-text-field label="Search" v-model="filterSearch" append-icon="mdi-magnify" />
      </v-card-title>

      <v-data-table
        :headers="headersTable"
        :items="stockData"
        item-key="_id"
        class="elevation-1"
        :search="filterSearch"
        mobile-breakpoint="0"
      >
        <template v-slot:item.value="{item}">{{ formatValue(item.value) }}</template>
        <template v-slot:item.total="{item}">{{ formatValue(item.total) }}</template>
        <template v-slot:item.edit_delete="{item}">
          <v-icon @click="confirmDelete = true, stockCurrent = item">mdi-delete</v-icon>
          <v-icon
            @click="dialogEditCreate = true, stockCurrent = item, stockCurrent.action = 'update'"
          >mdi-pencil</v-icon>
        </template>
        <template v-slot:body.append>
          <tr style="background-color:#f5f5f5">
            <td></td>
            <td></td>
            <td></td>
            <td class="font-weight-medium">Sum</td>
            <td
              class="success--text font-weight-medium"
            >{{ stockData ? stockData.reduce((acc, { amount }) => acc + amount, 0) : ''}}</td>
            <td
              class="success--text font-weight-medium"
            >{{ formatValue(stockData ? stockData.reduce((acc, { total }) => acc + total, 0) : '')}}</td>

            <td></td>
          </tr>
        </template>
      </v-data-table>
    </v-card>
    <!-- modal Confirm excluir -->
    <modal-confirm
      :modalConfirm="confirmDelete"
      @value="val => confirmDelete = val"
      @confirm="deleteStockEvent()"
      icon="mdi-close-circle-outline"
      msg="Are you sure you want to delete product?"
    />
    <!-- modal edit -->
    <v-dialog v-model="dialogEditCreate" max-width="400px">
      <v-card class="pb-4">
        <v-card-title
          class="mb-3"
        >{{ stockCurrent.action === 'create' ? 'Register Product' : 'Edit Product'}}</v-card-title>
        <v-card-text>
          <v-form ref="formStock">
            <v-text-field
              label="Description"
              v-model="stockCurrent.description"
              :rules="requiredRules"
            />
            <v-text-field label="Brand" v-model="stockCurrent.brand" />
            <v-text-field label="Color" v-model="stockCurrent.color" />
            <v-text-field
              type="number"
              prefix="$"
              v-model="stockCurrent.value"
              :rules="requiredRules"
            />
            <v-text-field
              type="number"
              label="Quantity"
              v-model="stockCurrent.amount"
              :rules="requiredRules"
            />
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="dialogEditCreate = false">Cancel</v-btn>
          <v-btn color="green darken-1" text @click="() =>  saveStock() ">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script src="./script.js" />

<style src="./style.scss" lang="scss"/>